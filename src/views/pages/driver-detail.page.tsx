import React, { useState } from 'react';
import { useQuery, useMutation, useLazyQuery } from '@apollo/client/react';

import {
    Box,
    Paper,
    Avatar,
    Typography,
    Chip,
    Tabs,
    Tab,
    Button,
    Grid,
    Divider,
    TextField,
    Rating,
    CircularProgress,
    Alert,
    useTheme,
    Stack
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import PlaceIcon from '@mui/icons-material/Place';
import EventIcon from '@mui/icons-material/Event';
import { GET_DRIVER_DOCUMENTS, GET_DRIVER_OVERVIEW } from 'graphql/queries/drivers.queries';
import { APPROVE_DRIVER_DOCUMENT_FILE, DELETE_DRIVER, REJECT_DRIVER_DOCUMENT_FILE } from 'graphql/mutations/driver.mutation';
import { useNavigate, useParams } from 'react-router';
import NotificationBanner from 'components/ui-component/snackbar/AppSnackBar';
import useNotification from 'hooks/useNotification';
import { DriverRideHistoryTab } from './driver-trips-tab';
import { BlockUnblockDriverDialog } from 'components/ui-component/block-driver-dialog';
import { DeleteUserDialog } from 'components/ui-component/extended/notistack/DeleteUserDialog';
import Image from 'components/ui-component/ImageComponent';
import DocumentsTabLayout from 'components/ui-component/driverDocuments';

interface SelectedFile {
    documentId: string;
    documentType: string;
    side: string;
    s3Key: string;
    status: string;
    fileId: string;
}
// ---------------------------------------------------------------------------
// Small status -> color maps, kept outside the component so they aren't
// recreated on every render.
// ---------------------------------------------------------------------------
const statusColor: Record<string, 'success' | 'default' | 'error'> = {
    ACTIVE: 'success',
    BLOCKED: 'error',
    INACTIVE: 'default'
};

const ChipColorStyle = {
    backgroundColor: '#EAF6EA',
    border: '1px solid #BFE6C4'
};

export default function DriverDetailsPage() {
    const [activeTab, setActiveTab] = useState<'details' | 'documents' | 'rides'>('details');
    const [infoSubTab, setInfoSubTab] = useState<'basic' | 'vehicle'>('basic');
    const { id: driverId } = useParams<{ id: string }>(); // matches your route /drivers/:id
    const theme = useTheme();
    const wrappingLabelSx = {
        height: 'auto',
        borderRadius: 9,
        ...ChipColorStyle,
        '& .MuiChip-label': {
            whiteSpace: 'normal' as const,
            py: 0.75,
            px: 3,
            color: theme.palette.secondary.main
        }
    };
    const handleReject = async () => {
        if (!selectedFile) return;
        const reason = window.prompt('Rejection reason:');
        if (!reason) return; // bail if admin cancels or leaves it blank

        await rejectFile({
            variables: {
                input: {
                    documentFileId: selectedFile.fileId,
                    rejectionReason: reason
                }
            },
            // optionally refetch the driver documents list so status updates in the table
            refetchQueries: ['GetDriverDocuments'] // match your actual query's operation name
        });
    };

    // ---------------------------------------------------------------------
    // OVERVIEW QUERY — fires immediately on mount.
    //
    // fetchPolicy: 'cache-and-network' — this is the fix for the exact bug
    // you hit on Wego's driver list. If we used the default 'cache-first',
    // navigating back to this page after blocking the driver from a list
    // elsewhere would show STALE data, because Apollo would see a cache
    // entry already exists and skip the network call entirely.
    // 'cache-and-network' shows the cached entry instantly (fast UI) but
    // still re-validates against the server in the background.
    //

    const { data, loading, error, refetch } = useQuery(GET_DRIVER_OVERVIEW, {
        variables: { driverId: driverId! },
        fetchPolicy: 'cache-and-network'
    });

    const [openBlockUnblockDialog, setOpenBlockUnblockDialog] = useState(false);
    const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null);
    const navigate = useNavigate();
    // ---------------------------------------------------------------------
    // DOCUMENTS QUERY — useLazyQuery means this does NOT fire on mount.
    // We trigger it manually the first time the Documents tab is opened.
    // This is the "defer non-critical data" half of the query-splitting
    // decision: no point paying for this fetch if the admin never clicks
    // the tab.
    // ---------------------------------------------------------------------

    // ---------------------------------------------------------------------
    // RIDE HISTORY QUERY — same lazy pattern, plus its own pagination
    // state. Keeping this separate means a slow/expensive ride-history
    // aggregation on the backend never blocks or slows down the initial
    // page render.

    const statusChipColor: Record<string, 'success' | 'warning' | 'error' | 'default'> = {
        APPROVED: 'success',
        PENDING: 'warning',
        REJECTED: 'error',
        VERIFIED: 'success'
    };
    function formatDocLabel(type: string, side: string) {
        const typeLabel = type
            .replace(/_/g, ' ')
            .toLowerCase()
            .replace(/\b\w/g, (c) => c.toUpperCase()); // "DRIVING_LICENSE" -> "Driving License"
        return `${typeLabel} (${side.charAt(0)}${side.slice(1).toLowerCase()})`;
    }

    function formatDate(iso: string) {
        return new Date(iso).toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric'
        });
    }

    const handleTabChange = (_: React.SyntheticEvent, value: typeof activeTab) => {
        setActiveTab(value);
        // Fire the lazy query the FIRST time each tab is opened.
        // Apollo caches the result after that, so re-clicking the tab
        // is instant (and cache-and-network still quietly refreshes it).
        // if (value === 'documents' && !docsResult.called) {
        //     loadDocuments({
        //         variables: { driverId: driverId! }
        //     });
        // }
        // if (value === 'rides' && !rideHistoryResult.called) {
        //     loadRideHistory({ variables: { driverId, page, limit: 10 } });
        // }

        console.log(selectedFile, 'sf');
    };
    const { notification, showSuccess, showError, clearNotification } = useNotification();

    const [approveFile, { loading: approving }] = useMutation(APPROVE_DRIVER_DOCUMENT_FILE, {
        onCompleted: () => {
            showSuccess('Document approved successfully');
        },
        onError: (err) => {
            showError(err.message || 'Failed to approve document');
        },
        refetchQueries: ['GetDriverDocuments']
    });

    const [rejectFile, { loading: rejecting }] = useMutation(REJECT_DRIVER_DOCUMENT_FILE, {
        onCompleted: () => {
            showSuccess('Document rejected');
        },
        onError: (err) => {
            showError(err.message || 'Failed to reject document');
        },
        refetchQueries: ['GetDriverDocuments']
    });

    // ---------------------------------------------------------------------
    // MUTATIONS
    //
    // Note there's no `refetchQueries` or `update` function here for
    // status changes. That's deliberate: BLOCK_DRIVER/UNBLOCK_DRIVER
    // return { id, status }. Apollo's normalized cache matches that id
    // against the Driver entity already sitting in the cache (populated
    // by GET_DRIVER_OVERVIEW) and merges just the `status` field.
    // This component re-renders with the new status automatically —
    // no network round trip, no manual cache surgery.
    // ---------------------------------------------------------------------

    const [deleteDriver, { loading: deleting }] = useMutation(DELETE_DRIVER, {
        onCompleted: () => {
            console.log('completeing delete');

            setDeleteDialogOpen(false);
            navigate('/drivers', {
                state: {
                    notification: {
                        message: 'Driver deleted successfully',
                        severity: 'success'
                    }
                }
            });
        },
        onError: (err) => {
            showError('Failed to delete driver');
            console.log('DeleteDriver failed:', err.message);
        }
    });
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const handleConfirmDelete = () => {
        if (!currentDriver) return;

        deleteDriver({
            variables: {
                input: {
                    driverId: currentDriver.userId
                }
            }
        });
    };

    if (loading && !data) {
        return (
            <Box display="flex" justifyContent="center" p={6}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ m: 3 }}>
                Failed to load driver: {error.message}
            </Alert>
        );
    }

    if (!data) return null;
    const currentDriver = {
        id: data.getDriver.userId,
        userId: data.getDriver.userId,
        fullName: data.getDriver.fullName,
        phone: data.getDriver.phone,
        profileImage: data.getDriver.profileImage,
        status: data.getDriver.status,
        suspended: data.getDriver.suspended,
        totalRidesAsDriver: data.getDriver.totalRidesAsDriver,
        totalEarnings: data.getDriver.totalEarnings,
        rating: data.getDriver.rating,
        joinedDate: data.getDriver.joinedDate
    };
    const driver = data?.getDriver;
    if (!driver) return null;

    return (
        <Box sx={{ bgcolor: '#f5f6f8', minHeight: '100vh' }}>
            <NotificationBanner
                open={Boolean(notification?.message)}
                message={notification?.message ?? ''}
                onClose={clearNotification}
                severity={notification?.severity ?? 'success'}
            />
            {/* ---- Top tab bar (Details / Documents / Ride History) ---- */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Tabs value={activeTab} onChange={handleTabChange}>
                    <Tab label="Details" value="details" />
                    <Tab
                        value="documents"
                        label={
                            <>Documents</>
                            // TODO<Badge badgeContent={driver.pendingDocumentsCount} color="warning">
                            //     <Box sx={{ pr: driver.pendingDocumentsCount ? 1.5 : 0 }}>Documents</Box>
                            // </Badge>
                        }
                    />
                    <Tab label="Ride History" value="rides" />
                </Tabs>

                {/* <Button variant="contained" color="warning">
                    Verify KYC
                </Button> */}
            </Box>
            {activeTab === 'details' && (
                <>
                    {/* ---- Header summary card ---- */}
                    <Paper sx={{ p: 3, mb: 2 }}>
                        <Grid container rowSpacing={3} columnSpacing={3}>
                            <Grid item xs={12} md={6}>
                                <Box display="flex" alignItems="start" justifyContent="space-between" gap={4}>
                                    <Box display="flex" gap={3}>
                                        <Avatar src={driver.profileImage} sx={{ width: 98, height: 98 }}>
                                            {driver.fullName?.[0]}
                                        </Avatar>
                                        <Box display="flex" flexDirection="column" gap={1}>
                                            <Typography variant="h6">{driver.fullName}</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {driver.id}
                                            </Typography>
                                            <Box>
                                                <Chip
                                                    label="Active"
                                                    // {driver.status}
                                                    color={
                                                        statusColor['ACTIVE'] ??
                                                        // statusColor[driver.status]
                                                        'default'
                                                    }
                                                    size="small"
                                                    sx={wrappingLabelSx}
                                                />
                                            </Box>
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <PhoneIcon fontSize="small" color="action" />
                                                <Typography variant="body2">{driver.phone}</Typography>
                                            </Box>
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <EmailIcon fontSize="small" color="action" />
                                                <Typography variant="body2">{driver.email}</Typography>
                                            </Box>
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <PlaceIcon fontSize="small" color="action" />
                                                <Typography variant="body2">{driver.address}</Typography>
                                            </Box>
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <EventIcon fontSize="small" color="action" />
                                                <Typography variant="body2">{driver.joinedDate} (Joined Date)</Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                    <Divider orientation="vertical" flexItem />{' '}
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Grid container rowSpacing={4}>
                                    <Grid item xs={6} md={4}>
                                        <StatBlock label="Driver Status">
                                            <Chip label={driver.status} size="small" />
                                        </StatBlock>
                                    </Grid>

                                    <Grid item xs={6} md={4}>
                                        <StatBlock label="Commission to Pay">
                                            <Typography color="error" fontWeight={600}>
                                                Rs. {driver.amountDueToCompany}
                                            </Typography>
                                        </StatBlock>
                                        {/* <StatBlock label="Web/Online">Rs. {driver.webOnlineRate}</StatBlock> */}
                                    </Grid>
                                    <Grid item xs={6} md={4}>
                                        {' '}
                                        <StatBlock label="Total Rides">{driver.totalRidesAsDriver}</StatBlock>
                                    </Grid>
                                    <Grid item xs={6} md={4}>
                                        <StatBlock label="Rating">
                                            <Box display="flex" alignItems="center" gap={0.5}>
                                                {driver.rating}
                                                <Rating value={driver.rating} readOnly size="small" precision={0.1} />
                                            </Box>
                                        </StatBlock>
                                    </Grid>
                                    <Grid item xs={6} md={4}>
                                        <StatBlock label="Total Earnings">Rs. {driver.totalEarnings}</StatBlock>
                                    </Grid>
                                    <Grid item xs={6} md={4}>
                                        <StatBlock label="Last Trip Date">{driver.lastTripAt ?? '—'}</StatBlock>
                                    </Grid>
                                    <Grid item xs={6} md={4}>
                                        <StatBlock label="Last Trip Time">
                                            {driver.lastTripStartTime && driver.lastTripEndTime
                                                ? `${driver.lastTripStartTime} - ${driver.lastTripEndTime}`
                                                : '—'}
                                        </StatBlock>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Paper>

                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        {/* ---- Basic Info / Vehicle Info sub-tabs ---- */}
                        <Tabs value={infoSubTab} onChange={(_, v) => setInfoSubTab(v)}>
                            <Tab label="Basic Information" value="basic" />
                            <Tab label="Vehicle Information" value="vehicle" />
                        </Tabs>
                    </Box>

                    <Paper sx={{ p: 3 }}>
                        {infoSubTab === 'basic' && (
                            <Grid container spacing={3}>
                                <GridItem5Container>
                                    <Field label="Phone" value={driver.phone} />
                                </GridItem5Container>
                                <GridItem6Container>
                                    <Field label="Gender" value={driver.gender} />
                                </GridItem6Container>
                                <Grid item xs={0} md={1} />
                                <GridItem5Container>
                                    <Field label="Email" value={driver.email} />
                                </GridItem5Container>
                                <GridItem6Container>
                                    <Field label="Citizenship No." value={driver.citizenshipNumber} />
                                </GridItem6Container>
                                <Grid item xs={0} md={1} />
                                <GridItem5Container>
                                    <Field label="Date of Birth" value={driver.dateOfBirth} />{' '}
                                </GridItem5Container>
                                <GridItem6Container>
                                    <Field label="Joined" value={driver.joinedDate} />
                                </GridItem6Container>
                                <Grid item xs={0} md={1} />
                                <GridItem5Container>
                                    <Field label="Emergency Contact" value={`${driver?.emergencyContact ?? '—'}`} />{' '}
                                </GridItem5Container>

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        minRows={3}
                                        label="KYC Notes"
                                        placeholder="Enter notes regarding KYC verification..."
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <Divider sx={{ my: 1 }} />
                                    <Box display="flex" gap={2}>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            sx={{ borderRadius: 2 }}
                                            disabled={loading}
                                            onClick={() => setOpenBlockUnblockDialog(!openBlockUnblockDialog)}
                                        >
                                            {driver.status === 'BLOCKED' ? 'Unblock Driver' : 'Block Driver'}
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            sx={{ borderColor: theme.palette.primary.main, borderRadius: 2 }}
                                            color="error"
                                            disabled={deleting}
                                            onClick={() => setDeleteDialogOpen(true)}
                                        >
                                            Delete Driver
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        )}

                        {/* {infoSubTab === 'vehicle' && driver.vehicle && (
                            <Grid container spacing={3}>
                                <Field label="Vehicle Type" value={driver.vehicle.vehicleType} />
                                <Field label="Name" value={driver.vehicle.name} />
                                <Field label="Model / Year" value={`${driver.vehicle.vehicleModel} (${driver.vehicle.year})`} />
                                <Field label="Color" value={driver.vehicle.color} />
                                <Field label="Number Plate" value={driver.vehicle.numberPlate} />
                            </Grid>
                        )} */}
                    </Paper>
                </>
            )}
            {activeTab === 'documents' && (
                <Stack gap={3}>
                    <NotificationBanner
                        open={Boolean(notification?.message)}
                        message={notification?.message ?? ''}
                        onClose={clearNotification}
                        severity={notification?.severity ?? 'success'}
                    />
                    <Stack
                        direction={{ xs: 'column', md: 'row' }}
                        divider={
                            <Divider
                                orientation="vertical"
                                flexItem
                                sx={{
                                    display: { xs: 'none', md: 'block' }
                                }}
                            />
                        }
                        sx={{
                            minHeight: 120,
                            height: { md: 165 },
                            paddingTop: 2,
                            paddingBottom: 2,
                            bgcolor: theme.palette.background.paper
                        }}
                    >
                        <Box sx={{ flex: 1, p: 2 }}>
                            <Box display="flex" gap={2} alignItems="center">
                                <Avatar src={driver.profileImage} sx={{ width: 60, height: 60 }}>
                                    {driver.fullName?.[0]}
                                </Avatar>
                                <Box display="flex" flexDirection="column" gap={0.25}>
                                    <Typography variant="h6">{driver.fullName}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        ID:4567-899
                                        {/* {driver.id} */}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>

                        <Box sx={{ flex: 2, p: 2 }}>
                            <Box display="flex" justifyContent="space-between">
                                <Box display="flex" gap={4} alignItems="start">
                                    <Image
                                        src={driver.profileImage}
                                        alt="mm"
                                        sx={{
                                            width: 80,
                                            height: 80,
                                            borderRadius: 2
                                        }}
                                    />
                                    <Stack direction="column" gap={1}>
                                        <Typography variant="h3">Info</Typography>
                                        <Typography>Model</Typography>
                                        <Chip
                                            label="Car"
                                            sx={{
                                                paddingTop: '6px',
                                                paddingBottom: '6px',
                                                paddingLeft: '20px',
                                                paddingRight: '20px',
                                                borderRadius: '8px',
                                                backgroundColor: '#B8B8B8'
                                            }}
                                        />
                                    </Stack>
                                </Box>
                                <Box display="flex" gap={2}>
                                    <Box>
                                        <Chip label="Active" color={statusColor['ACTIVE'] ?? 'default'} size="small" sx={wrappingLabelSx} />
                                    </Box>
                                    <Box>
                                        <Chip
                                            label="Pending"
                                            color={statusColor['ACTIVE'] ?? 'default'}
                                            size="small"
                                            sx={wrappingLabelSx}
                                        />
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Stack>
                    <DocumentsTabLayout driverId={driverId!} />{' '}
                </Stack>
            )}
            {activeTab === 'rides' && <DriverRideHistoryTab driverId={driverId!} />}{' '}
            {deleteDialogOpen && (
                <DeleteUserDialog
                    open={deleteDialogOpen}
                    userName={currentDriver?.fullName}
                    loading={deleting}
                    onClose={() => {
                        setDeleteDialogOpen(false);
                    }}
                    onConfirm={handleConfirmDelete}
                />
            )}
            {openBlockUnblockDialog && (
                <BlockUnblockDriverDialog
                    driver={currentDriver}
                    showError={showError}
                    showSuccess={showSuccess}
                    onClose={() => setOpenBlockUnblockDialog(false)}
                    refetch={refetch}
                />
            )}
        </Box>
    );
}

// ---------------------------------------------------------------------------
// Tiny presentational helpers, kept in this file for a self-contained demo.
// In your real project these'd move to their own components file.
// ---------------------------------------------------------------------------
function StatBlock({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <Stack gap={0.75}>
            <Typography variant="caption" color="text.secondary">
                {label}
            </Typography>
            <Typography variant="body1">{children}</Typography>
        </Stack>
    );
}

function Field({ label, value }: { label: string; value?: React.ReactNode }) {
    return (
        <>
            <Grid container>
                <Grid item xs={4}>
                    <Typography variant="caption" color="text.secondary">
                        {label}
                    </Typography>
                </Grid>

                <Grid item xs={8}>
                    <Typography variant="body1">{value ?? '—'}</Typography>
                </Grid>
            </Grid>
        </>
    );
}

function GridItem5Container({ children }: { children: React.ReactNode }) {
    return (
        <Grid item xs={12} md={5}>
            {children}
        </Grid>
    );
}

function GridItem6Container({ children }: { children: React.ReactNode }) {
    return (
        <Grid item xs={12} md={6}>
            {children}
        </Grid>
    );
}
