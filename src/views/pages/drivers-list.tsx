// components/drivers/DriverList.tsx
import { useState, MouseEvent, useEffect } from 'react';
import {
    Box,
    Card,
    Stack,
    Tabs,
    TextField,
    InputAdornment,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Avatar,
    Typography,
    Rating,
    IconButton,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Skeleton,
    ToggleButtonGroup,
    ToggleButton,
    Chip,
    TablePagination,
    useTheme,
    useMediaQuery
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import BlockIcon from '@mui/icons-material/Block';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { DriverListItem } from 'types/drivers.types';
import { useDebounce } from 'hooks/useDebounce';
import { useMutation, useQuery } from '@apollo/client/react';
import { GET_DRIVERS } from 'graphql/queries/drivers.queries';
import { GetDriversQueryResult } from 'types/drivers-list.response';
import { UserStatusChip } from 'components/ui-component/UserStatusChip';
import { DeleteUserDialog } from 'components/ui-component/extended/notistack/DeleteUserDialog';
import { DELETE_DRIVER } from 'graphql/mutations/driver.mutation';
import { BlockUnblockDriverDialog } from 'components/ui-component/block-driver-dialog';
import { useLocation, useNavigate } from 'react-router';
import { useUrlParams } from 'hooks/useSearchParams';
import ResponsiveTableLayoutCustom from 'components/ui-component/responsive-layout';
import CustomTab from 'components/ui-component/extended/notistack/CustomTab';
import NotificationBanner from 'components/ui-component/snackbar/AppSnackBar';
import useNotification from 'hooks/useNotification';
import { CustomPaginationActions } from 'components/ui-component/actionsComponent';

const TABS = [
    { key: 'ACTIVE', label: 'Active' },
    { key: 'PENDING', label: 'Pending' },
    { key: 'BLOCKED', label: 'Blocked' }
] as const;

const DEFAULT_TAB = 'ACTIVE';
const DEFAULT_LIMIT = 10;
enum DRIVER_TABS_ENUM {
    ACTIVE = 'ACTIVE',
    PENDING = 'PENDING',
    BLOCKED = 'BLOCKED'
}

const COLUMNS = [
    { label: 'Driver', width: '32%' },
    { label: 'Phone', width: '20%' },
    { label: 'Status', width: '11%' },
    { label: 'Rides', width: '10%' },
    { label: 'Rating', width: '15%' },
    { label: 'Earnings', width: '8%' },
    { label: '', width: '5%' }
];

const DriverList = () => {
    const [tab, setTab] = useState<string>(DRIVER_TABS_ENUM.ACTIVE);
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 400);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
    const [blockDialogOpen, setBlockDialogOpen] = useState(false);
    const { notification, showSuccess, showError, clearNotification } = useNotification();

    const [deleteDriver, { loading: deleting }] = useMutation(DELETE_DRIVER, {
        onCompleted: () => {
            setDeleteDialogOpen(false);
            setSelectedId(null);
            refetch();
            showSuccess('Driver deleted successfully');
        },
        onError: (err) => {
            showError('Failed to delete driver');
            console.log('DeleteDriver failed:', err.message);
        }
    });
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const handleDeleteClick = () => {
        setDeleteDialogOpen(true);
        setMenuAnchor(null); // close menu, keep selectedPassenger
    };

    const handleConfirmDelete = () => {
        if (!selectedDriver) return;

        deleteDriver({
            variables: {
                input: {
                    driverId: selectedDriver.id
                }
            }
        });
    };
    const closeMenu = () => {
        setMenuAnchor(null);
    };
    const navigate = useNavigate();
    const closeDialog = () => {
        setBlockDialogOpen(false);
        setSelectedId(null);
    };
    const handleBlockClick = () => {
        setBlockDialogOpen(true);
        setMenuAnchor(null); // close menu, keep selectedPassenger
    };

    const { data, loading, refetch } = useQuery<GetDriversQueryResult>(GET_DRIVERS, {
        variables: {
            input: {
                page,
                limit,
                status: tab,
                search: debouncedSearch || undefined
            }
        },
        fetchPolicy: 'cache-and-network'
    });
    const handleRowClick = (driverId: string) => {
        navigate(`/drivers/${driverId}`);
    };
    const openMenu = (e: MouseEvent<HTMLElement>, driver: DriverListItem) => {
        setMenuAnchor(e.currentTarget);
        setSelectedId(driver.id);
    };
    const drivers: DriverListItem[] = data?.getDrivers?.data ?? [];
    const totalPending = data?.getDrivers?.totalPending ?? 0;
    const totalBlocked = data?.getDrivers?.totalBlocked ?? 0;
    const selectedDriver = drivers.find((d) => d.id === selectedId);

    const total = data?.getDrivers?.pagination?.total ?? 0;
    const handleTabChange = (_: React.SyntheticEvent, value: string) => {
        setTab(value);
        setPage(0);
    };
    const location = useLocation();

    useEffect(() => {
        if (location.state?.notification) {
            showSuccess(location.state.notification.message);

            navigate(location.pathname, {
                replace: true,
                state: null
            });
        }
    }, [location, navigate]);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    return (
        <Stack gap={2.5}>
            <NotificationBanner
                open={Boolean(notification?.message)}
                message={notification?.message ?? ''}
                onClose={clearNotification}
                severity={notification?.severity ?? 'success'}
            />
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '24px',
                    gap: 5
                }}
            >
                <TextField
                    placeholder="Search driver..."
                    size="small"
                    InputProps={{ startAdornment: <SearchIcon /> }}
                    sx={{ width: '50%', minWidth: 200 }}
                    onChange={(e) => setSearch(e.target.value)} // secondaryText → placeholder color already comes from MuiInputBase override (text.secondary)
                />
                <ToggleButtonGroup
                    exclusive
                    value={tab}
                    onChange={handleTabChange}
                    orientation={isMobile ? 'vertical' : 'horizontal'}
                    fullWidth={isMobile}
                >
                    {TABS.map(({ key, label }) => (
                        <ToggleButton key={key} value={key}>
                            <Typography
                                variant="subtitle2"
                                sx={{
                                    fontSize: '13px',
                                    fontWeight: 700,
                                    color: tab === key ? 'text.dark' : 'text.secondary'
                                }}
                            >
                                {label}
                            </Typography>
                            {key !== 'ACTIVE' && (
                                <Chip
                                    size="small"
                                    label={<Typography variant="caption">{key === 'PENDING' ? totalPending : totalBlocked}</Typography>}
                                    sx={{ ml: 0.75 }}
                                />
                            )}
                        </ToggleButton>
                    ))}
                </ToggleButtonGroup>
            </Box>

            <ResponsiveTableLayoutCustom>
                <TableHead>
                    <TableRow>
                        {COLUMNS.map(({ label, width }, i) => (
                            <TableCell key={i} sx={{ width }} align={label === '' ? 'right' : 'left'}>
                                {label && (
                                    <Typography variant="h6" color="text.dark">
                                        {label}
                                    </Typography>
                                )}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {loading &&
                        Array.from({ length: limit }).map((_, i) => (
                            <TableRow key={i}>
                                {Array.from({ length: 7 }).map((__, j) => (
                                    <TableCell key={j}>
                                        <Skeleton variant="text" />
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}

                    {!loading &&
                        drivers.map((driver) => (
                            <TableRow key={driver.id} hover onClick={() => handleRowClick(driver.id)} sx={{ cursor: 'pointer' }}>
                                <TableCell>
                                    <Stack direction="row" spacing={1.5} alignItems="center">
                                        <Avatar
                                            src={driver.profileImage}
                                            sx={{
                                                width: 36,
                                                height: 36,
                                                bgcolor: 'secondary.light',
                                                color: 'text.dark'
                                            }}
                                        >
                                            {driver.fullName?.[0]}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="subtitle1">{driver.fullName}</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                ID · {driver.id.slice(-4)}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" color="text.primary">
                                        {driver.phone}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    {/* statusChip → subtitle2, colors: active=success, pending=warning, blocked=error.
                                        UserStatusChip's internals aren't shown here — make sure its label
                                        Typography uses variant="subtitle2" and its status→color map matches
                                        success.main/light, warning.main/light, error.main/light. */}
                                    <UserStatusChip status={driver.suspended ? 'BLOCKED' : driver.status} />
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" color="text.primary">
                                        {driver.totalRidesAsDriver || '—'}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    {driver.rating ? (
                                        <Stack direction="row" spacing={0.5} alignItems="center">
                                            <Rating
                                                value={driver.rating}
                                                precision={0.1}
                                                readOnly
                                                size="small"
                                                sx={{
                                                    color: 'orange.main',
                                                    '& .MuiRating-iconEmpty': { color: 'grey.300' }
                                                }}
                                            />
                                            <Typography variant="body2" color="text.primary">
                                                {driver.rating.toFixed(1)}
                                            </Typography>
                                        </Stack>
                                    ) : (
                                        '—'
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" color="success.main">
                                        {driver.totalEarnings}
                                    </Typography>
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton
                                        size="small"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openMenu(e, driver);
                                        }}
                                    >
                                        <MoreHorizIcon fontSize="small" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </ResponsiveTableLayoutCustom>

            <TablePagination
                component="div"
                count={total}
                page={page}
                rowsPerPage={limit}
                onPageChange={(_, newPage) => setPage(newPage)}
                onRowsPerPageChange={(e) => {
                    setLimit(parseInt(e.target.value, 10));
                    setPage(0);
                }}
                rowsPerPageOptions={[10, 25, 50]}
                ActionsComponent={CustomPaginationActions}
            />

            <DeleteUserDialog
                open={deleteDialogOpen}
                userName={selectedDriver?.fullName}
                loading={deleting}
                onClose={() => {
                    setDeleteDialogOpen(false);
                    setSelectedId(null);
                }}
                onConfirm={handleConfirmDelete}
            />
            {blockDialogOpen && selectedDriver && (
                <BlockUnblockDriverDialog
                    driver={selectedDriver}
                    onClose={closeDialog}
                    refetch={refetch}
                    showSuccess={showSuccess}
                    showError={showError}
                />
            )}
            <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={closeMenu}>
                <MenuItem onClick={handleBlockClick}>
                    <ListItemIcon>
                        <BlockIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                    </ListItemIcon>
                    <ListItemText primaryTypographyProps={{ color: 'text.secondary' }}>
                        {selectedDriver?.suspended ? 'Unblock' : 'Block'}
                    </ListItemText>
                </MenuItem>
                <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
                    <ListItemIcon>
                        <DeleteOutlineIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                </MenuItem>
            </Menu>
        </Stack>
    );
};

export default DriverList;
