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
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import PlaceIcon from '@mui/icons-material/Place';
import EventIcon from '@mui/icons-material/Event';
import { GET_DRIVER_DOCUMENTS, GET_DRIVER_OVERVIEW, GET_DRIVER_RIDE_HISTORY } from 'graphql/queries/drivers.queries';
import { BLOCK_DRIVER, DELETE_DRIVER, REVIEW_DOCUMENT, UNBLOCK_DRIVER } from 'graphql/mutations/driver.mutation';
import { useParams } from 'react-router';

interface SelectedFile {
    documentId: string;
    documentType: string;
    side: string;
    s3Key: string;
    status: string;
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

const kycColor: Record<string, 'warning' | 'success' | 'error'> = {
    PENDING: 'warning',
    APPROVED: 'success',
    REJECTED: 'error'
};

export default function DriverDetailsPage() {
    const [activeTab, setActiveTab] = useState<'details' | 'documents' | 'rides'>('details');
    const [infoSubTab, setInfoSubTab] = useState<'basic' | 'vehicle'>('basic');
    const { id: driverId } = useParams<{ id: string }>(); // matches your route /drivers/:id

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
    // ---------------------------------------------------------------------
    const { data, loading, error } = useQuery(GET_DRIVER_OVERVIEW, {
        variables: { driverId: driverId! },
        fetchPolicy: 'cache-and-network'
    });

    const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null);

    // ---------------------------------------------------------------------
    // DOCUMENTS QUERY — useLazyQuery means this does NOT fire on mount.
    // We trigger it manually the first time the Documents tab is opened.
    // This is the "defer non-critical data" half of the query-splitting
    // decision: no point paying for this fetch if the admin never clicks
    // the tab.
    // ---------------------------------------------------------------------
    const [loadDocuments, docsResult] = useLazyQuery(GET_DRIVER_DOCUMENTS, { fetchPolicy: 'cache-and-network' });
    // ---------------------------------------------------------------------
    // RIDE HISTORY QUERY — same lazy pattern, plus its own pagination
    // state. Keeping this separate means a slow/expensive ride-history
    // aggregation on the backend never blocks or slows down the initial
    // page render.
    // ---------------------------------------------------------------------
    const [page, setPage] = useState(0);
    const [loadRideHistory, rideHistoryResult] = useLazyQuery(GET_DRIVER_RIDE_HISTORY, {
        fetchPolicy: 'cache-and-network'
    });
    const statusChipColor: Record<string, 'success' | 'warning' | 'error' | 'default'> = {
        APPROVED: 'success',
        PENDING: 'warning',
        REJECTED: 'error'
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

    function buildS3Url(s3Key: string) {
        return `https://amazon-s3-pilot-testers.s3.eu-north-1.amazonaws.com/${s3Key}`;
    }

    const [reviewDocument, { loading: reviewing }] = useMutation(REVIEW_DOCUMENT);

    const handleTabChange = (_: React.SyntheticEvent, value: typeof activeTab) => {
        setActiveTab(value);
        // Fire the lazy query the FIRST time each tab is opened.
        // Apollo caches the result after that, so re-clicking the tab
        // is instant (and cache-and-network still quietly refreshes it).
        if (value === 'documents' && !docsResult.called) {
            loadDocuments({
                variables: { driverId: driverId! }
            });
        }
        if (value === 'rides' && !rideHistoryResult.called) {
            loadRideHistory({ variables: { driverId, page, limit: 10 } });
        }
    };

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
    const [blockDriver, { loading: blocking }] = useMutation(BLOCK_DRIVER, {
        variables: { driverId }
    });
    const [unblockDriver, { loading: unblocking }] = useMutation(UNBLOCK_DRIVER, {
        variables: { driverId }
    });

    // DELETE is the one case that genuinely needs manual cache handling,
    // because deleting doesn't "merge a field" — it removes an entity.
    // We use the `update` function to evict it, rather than refetching.
    //todo const [deleteDriver, { loading: deleting }] = useMutation(DELETE_DRIVER, {
    //     variables: { driverId },
    //     update(cache, { data: mutationData }) {
    //         const deletedId = mutationData?.deleteDriver?.id;
    //         if (deletedId) {
    //             cache.evict({ id: cache.identify({ __typename: 'Driver', id: deletedId }) });
    //             cache.gc();
    //         }
    //     }
    // });
    const [deleteDriver, { loading: deleting }] = useMutation(DELETE_DRIVER, {
        onCompleted: () => {
            // TODOsetDeleteDialogOpen(false);
            // setSelectedId(null);
            // refetch();
        },
        onError: (err) => {
            console.log('DeleteDriver failed:', err.message);
        }
    });

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

    const driver = data?.getDriver;
    if (!driver) return null;

    return (
        <Box sx={{ p: 3, bgcolor: '#f5f6f8', minHeight: '100vh' }}>
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

                <Button variant="contained" color="warning">
                    Verify KYC
                </Button>
            </Box>

            {activeTab === 'details' && (
                <>
                    {/* ---- Header summary card ---- */}
                    <Paper sx={{ p: 3, mb: 2 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={4}>
                                <Box display="flex" gap={2}>
                                    <Avatar src={driver.profileImage} sx={{ width: 72, height: 72 }}>
                                        {driver.fullName?.[0]}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h6">{driver.fullName}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            ID: {driver.id}
                                        </Typography>
                                        <Chip
                                            label={driver.status}
                                            color={statusColor[driver.status] ?? 'default'}
                                            size="small"
                                            sx={{ mt: 0.5 }}
                                        />
                                        <Box mt={1} display="flex" flexDirection="column" gap={0.5}>
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
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={5}>
                                <Grid container spacing={2}>
                                    <StatBlock label="KYC Status">
                                        <Chip
                                            label="verified/not verified"
                                            //TODO label={driver.kycStatus}
                                            // color={kycColor[driver.kycStatus] ?? 'default'} size="small"
                                        />
                                    </StatBlock>
                                    <StatBlock label="Driver Status">
                                        <Chip label={driver.status} size="small" />
                                    </StatBlock>
                                    <StatBlock label="Total Rides">{driver.totalRidesAsDriver}</StatBlock>
                                    <StatBlock label="Rating">
                                        <Box display="flex" alignItems="center" gap={0.5}>
                                            {driver.rating}
                                            <Rating value={driver.rating} readOnly size="small" precision={0.1} />
                                        </Box>
                                    </StatBlock>
                                    <StatBlock label="Last Trip Date">{driver.lastTripAt ?? '—'}</StatBlock>
                                    <StatBlock label="Last Trip Time">
                                        {driver.lastTripStartTime && driver.lastTripEndTime
                                            ? `${driver.lastTripStartTime} - ${driver.lastTripEndTime}`
                                            : '—'}
                                    </StatBlock>
                                </Grid>
                            </Grid>

                            <Grid item xs={12} md={3}>
                                <StatBlock label="Commission to Pay">
                                    <Typography color="error" fontWeight={600}>
                                        Rs. {driver.amountDueToCompany}
                                    </Typography>
                                </StatBlock>
                                <StatBlock label="Total Earnings">Rs. {driver.totalEarnings}</StatBlock>
                                {/* <StatBlock label="Web/Online">Rs. {driver.webOnlineRate}</StatBlock> */}
                            </Grid>
                        </Grid>
                    </Paper>

                    {/* ---- Basic Info / Vehicle Info sub-tabs ---- */}
                    <Tabs value={infoSubTab} onChange={(_, v) => setInfoSubTab(v)} sx={{ mb: 0, '& .MuiTab-root': { bgcolor: 'white' } }}>
                        <Tab label="Basic Information" value="basic" />
                        <Tab label="Vehicle Information" value="vehicle" />
                    </Tabs>

                    <Paper sx={{ p: 3 }}>
                        {infoSubTab === 'basic' && (
                            <Grid container spacing={3}>
                                <Field label="Phone" value={driver.phone} />
                                <Field label="Gender" value={driver.gender} />
                                <Field label="Email" value={driver.email} />
                                {/* <Field label="Citizenship No." value={driver.citizenshipNo} /> */}
                                <Field label="Date of Birth" value={driver.dateOfBirth} />
                                <Field label="Joined" value={driver.joinedDate} />
                                <Field
                                    label="Emergency Contact"
                                    value={`${driver?.emergencyContactPhone ?? '-'} (${driver?.emergencyContactName})`}
                                />

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
                                            disabled={blocking || unblocking}
                                            onClick={() => (driver.status === 'BLOCKED' ? unblockDriver() : blockDriver())}
                                        >
                                            {driver.status === 'BLOCKED' ? 'Unblock Driver' : 'Block Driver'}
                                        </Button>
                                        <Button variant="outlined" color="warning" disabled={deleting} onClick={() => deleteDriver()}>
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
                <Grid container spacing={2}>
                    {/* ---- Left: documents table ---- */}
                    <Grid item xs={12} md={7}>
                        <Paper sx={{ p: 3 }}>
                            <Typography fontWeight={600}>KYC Documents</Typography>
                            <Typography variant="body2" color="text.secondary" mb={2}>
                                Review uploaded documents and update status
                            </Typography>

                            {docsResult.loading && !docsResult.data && <CircularProgress size={24} />}
                            {docsResult.error && <Alert severity="error">{docsResult.error.message}</Alert>}

                            {docsResult.data && (
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Document</TableCell>
                                            <TableCell>Uploaded</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell align="right">Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {/* Flatten: one row per file, not per document.
                  This is why we need the .flatMap — the screenshot's
                  rows correspond to `files`, the query's top-level
                  array is `documents`. */}
                                        {docsResult.data.getDriver.documents.flatMap((doc) =>
                                            doc.files.map((file) => {
                                                const isSelected = selectedFile?.s3Key === file.s3Key;
                                                return (
                                                    <TableRow
                                                        key={file.s3Key}
                                                        hover
                                                        selected={isSelected}
                                                        onClick={() =>
                                                            setSelectedFile({
                                                                documentId: doc._id,
                                                                documentType: doc.type,
                                                                side: file.side,
                                                                s3Key: file.s3Key,
                                                                status: file.status
                                                            })
                                                        }
                                                        sx={{ cursor: 'pointer' }}
                                                    >
                                                        <TableCell>{formatDocLabel(doc.type, file.side)}</TableCell>
                                                        <TableCell>{formatDate(file.createdAt)}</TableCell>
                                                        <TableCell>
                                                            <Chip
                                                                size="small"
                                                                label={file.status}
                                                                color={statusChipColor[file.status] ?? 'default'}
                                                            />
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <Button
                                                                size="small"
                                                                onClick={(e) => {
                                                                    e.stopPropagation(); // don't also trigger row select
                                                                    setSelectedFile({
                                                                        documentId: doc._id,
                                                                        documentType: doc.type,
                                                                        side: file.side,
                                                                        s3Key: file.s3Key,
                                                                        status: file.status
                                                                    });
                                                                }}
                                                            >
                                                                Preview
                                                            </Button>
                                                            <Button size="small" sx={{ ml: 1 }}>
                                                                Download
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })
                                        )}
                                    </TableBody>
                                </Table>
                            )}
                        </Paper>
                    </Grid>

                    {/* ---- Right: preview + approve/reject ---- */}
                    <Grid item xs={12} md={5}>
                        <Paper sx={{ p: 3, height: '100%' }}>
                            <Typography fontWeight={600}>Preview</Typography>
                            <Typography variant="body2" color="text.secondary" mb={2}>
                                {selectedFile
                                    ? formatDocLabel(selectedFile.documentType, selectedFile.side)
                                    : 'Select a document to review'}
                            </Typography>

                            <Box
                                sx={{
                                    height: 320,
                                    bgcolor: '#f5f6f8',
                                    borderRadius: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                {selectedFile ? (
                                    <img
                                        src={buildS3Url(selectedFile.s3Key)}
                                        alt="document preview"
                                        style={{ maxWidth: '100%', maxHeight: '100%' }}
                                    />
                                ) : (
                                    <Typography color="text.secondary">Document Preview Area</Typography>
                                )}
                            </Box>

                            <Box display="flex" gap={2} mt={2}>
                                <Button
                                    variant="contained"
                                    color="success"
                                    disabled={!selectedFile || reviewing}
                                    onClick={() =>
                                        selectedFile &&
                                        reviewDocument({
                                            variables: {
                                                documentId: selectedFile.documentId,
                                                status: 'APPROVED'
                                            }
                                        })
                                    }
                                >
                                    Approve
                                </Button>
                                <Button
                                    variant="contained"
                                    color="error"
                                    disabled={!selectedFile || reviewing}
                                    onClick={() =>
                                        selectedFile &&
                                        reviewDocument({
                                            variables: {
                                                documentId: selectedFile.documentId,
                                                status: 'REJECTED'
                                            }
                                        })
                                    }
                                >
                                    Reject
                                </Button>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
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
        <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">
                {label}
            </Typography>
            <Typography variant="body1">{children}</Typography>
        </Grid>
    );
}

function Field({ label, value }: { label: string; value?: React.ReactNode }) {
    return (
        <Grid item xs={12} md={6}>
            <Typography variant="caption" color="text.secondary">
                {label}
            </Typography>
            <Typography variant="body1">{value ?? '—'}</Typography>
        </Grid>
    );
}
