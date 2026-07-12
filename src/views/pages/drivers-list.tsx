// components/drivers/DriverList.tsx
import { useState, MouseEvent } from 'react';
import {
    Box,
    Card,
    Stack,
    Tabs,
    Tab,
    Badge,
    TextField,
    InputAdornment,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TablePagination,
    Avatar,
    Typography,
    Rating,
    IconButton,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Skeleton
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
import { useNavigate } from 'react-router';

const TABS = [
    { key: 'ACTIVE', label: 'Active' },
    { key: 'PENDING', label: 'Pending' },
    { key: 'BLOCKED', label: 'Blocked' }
] as const;

const DriverList = () => {
    const [tab, setTab] = useState<string>('ACTIVE');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10);
    const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [blockDialogOpen, setBlockDialogOpen] = useState(false);
    const debouncedSearch = useDebounce(search, 400);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const navigate = useNavigate();
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
    const closeDialog = () => {
        setBlockDialogOpen(false);
        setSelectedId(null);
    };

    const handleRowClick = (driverId: string) => {
        navigate(`/drivers/${driverId}`);
    };

    const [deleteDriver, { loading: deleting }] = useMutation(DELETE_DRIVER, {
        onCompleted: () => {
            setDeleteDialogOpen(false);
            setSelectedId(null);
            refetch();
        },
        onError: (err) => {
            console.log('DeleteDriver failed:', err.message);
        }
    });

    // ---- Menu-item click handlers: ONLY open dialogs, never call mutations ----
    const handleBlockClick = () => {
        setBlockDialogOpen(true);
        setMenuAnchor(null); // close menu, keep selectedDriver
    };

    const handleDeleteClick = () => {
        setDeleteDialogOpen(true);
        setMenuAnchor(null); // close menu, keep selectedDriver
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
    const drivers: DriverListItem[] = data?.getDrivers?.data ?? [];
    const total = data?.getDrivers?.pagination?.total ?? 0;
    const selectedDriver = drivers.find((d) => d.id === selectedId);
    const handleTabChange = (_: React.SyntheticEvent, value: string) => {
        setTab(value);
        setPage(0);
    };

    const openMenu = (e: MouseEvent<HTMLElement>, driver: DriverListItem) => {
        setMenuAnchor(e.currentTarget);
        setSelectedId(driver.id);
    };

    const closeMenu = () => {
        setMenuAnchor(null);
        // NOTE: don't clear selectedDriver here — dialogs opened from this menu
        // need it. selectedDriver is cleared explicitly in each dialog's onClose.
    };

    return (
        <Card sx={{ p: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <TextField
                    placeholder="Search driver..."
                    size="small"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(0);
                    }}
                    sx={{ width: 320 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon fontSize="small" color="disabled" />
                            </InputAdornment>
                        )
                    }}
                />

                <Tabs
                    value={tab}
                    onChange={handleTabChange}
                    sx={{
                        minHeight: 40,
                        '& .MuiTabs-indicator': { display: 'none' },
                        '& .MuiTab-root': {
                            minHeight: 40,
                            borderRadius: '8px',
                            mx: 0.5,
                            textTransform: 'none',
                            fontWeight: 500,
                            '&.Mui-selected': {
                                bgcolor: 'success.lighter',
                                color: 'success.dark'
                            }
                        }
                    }}
                >
                    {TABS.map((t) => (
                        <Tab
                            key={t.key}
                            value={t.key}
                            label={
                                t.key === 'ACTIVE' ? (
                                    t.label
                                ) : (
                                    <Stack direction="row" spacing={0.75} alignItems="center">
                                        <span>{t.label}</span>
                                        <Badge
                                            badgeContent={undefined}
                                            sx={{
                                                bgcolor: 'grey.200',
                                                borderRadius: '10px',
                                                px: 0.75,
                                                fontSize: 12
                                            }}
                                        />
                                    </Stack>
                                )
                            }
                        />
                    ))}
                </Tabs>
            </Stack>
            <Box sx={{ overflowX: 'auto' }}>
                <Box sx={{ minWidth: 1500 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Driver</TableCell>
                                <TableCell>Phone</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Rides</TableCell>
                                <TableCell>Rating</TableCell>
                                <TableCell>Earnings</TableCell>
                                <TableCell align="right" />
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
                                                <Avatar src={driver.profileImage} sx={{ width: 36, height: 36 }}>
                                                    {driver.fullName?.[0]}
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="subtitle2">{driver.fullName}</Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        ID · {driver.id.slice(-4)}
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                        </TableCell>
                                        <TableCell>{driver.phone}</TableCell>
                                        <TableCell>
                                            <UserStatusChip status={driver.suspended ? 'BLOCKED' : driver.status} />
                                        </TableCell>
                                        <TableCell>{driver.totalRidesAsDriver || '—'}</TableCell>
                                        <TableCell>
                                            {driver.rating ? (
                                                <Stack direction="row" spacing={0.5} alignItems="center">
                                                    <Rating value={driver.rating} precision={0.1} readOnly size="small" />
                                                    <Typography variant="body2">{driver.rating.toFixed(1)}</Typography>
                                                </Stack>
                                            ) : (
                                                '—'
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {driver.totalEarnings ? (
                                                <Typography color="success.main" fontWeight={600}>
                                                    Rs. {driver.totalEarnings.toLocaleString()}
                                                </Typography>
                                            ) : (
                                                '—'
                                            )}
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
                    </Table>
                </Box>
            </Box>{' '}
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
                <BlockUnblockDriverDialog driver={selectedDriver} onClose={closeDialog} refetch={refetch} />
            )}
            {/* Menu itself has NO onClick — only individual MenuItems trigger actions */}
            <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={closeMenu}>
                <MenuItem onClick={handleBlockClick}>
                    <ListItemIcon>
                        <BlockIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>{selectedDriver?.suspended ? 'Unblock' : 'Block'}</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
                    <ListItemIcon>
                        <DeleteOutlineIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                </MenuItem>
            </Menu>
        </Card>
    );
};

export default DriverList;
