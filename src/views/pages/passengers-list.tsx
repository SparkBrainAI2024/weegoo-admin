// components/passengers/PassengerList.tsx
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
import { useDebounce } from 'hooks/useDebounce';
import { useMutation, useQuery } from '@apollo/client/react';
import { GET_PASSENGERS, GetPassengersQueryResult } from 'graphql/queries/passenger.queries';
import { UserStatusChip } from 'components/ui-component/UserStatusChip';
import { DeleteUserDialog } from 'components/ui-component/extended/notistack/DeleteUserDialog';
import { DELETE_PASSENGER } from 'graphql/mutations/passenger.mutation';
import { PassengerListItem } from 'types/passengers.types';
import { BlockUnblockPassengerDialog } from 'components/ui-component/block-passenger.dialog';
import { useNavigate } from 'react-router';

const TABS = [
    { key: 'ACTIVE', label: 'Active' },
    { key: 'PENDING', label: 'Pending' },
    { key: 'BLOCKED', label: 'Blocked' }
] as const;

const PassengerList = () => {
    const [tab, setTab] = useState<string>('ACTIVE');
    const [search, setSearch] = useState('');
    const navigate = useNavigate();
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10);
    const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [blockDialogOpen, setBlockDialogOpen] = useState(false);
    const debouncedSearch = useDebounce(search, 400);
    const handleRowClick = (driverId: string) => {
        navigate(`/passengers/${driverId}`);
    };
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const { data, loading, refetch } = useQuery<GetPassengersQueryResult>(GET_PASSENGERS, {
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

    const [deletePassenger, { loading: deleting }] = useMutation(DELETE_PASSENGER, {
        onCompleted: () => {
            setDeleteDialogOpen(false);
            setSelectedId(null);
            refetch();
        },
        onError: (err) => {
            console.log('DeletePassenger failed:', err.message);
        }
    });

    // ---- Menu-item click handlers: ONLY open dialogs, never call mutations ----
    const handleBlockClick = () => {
        setBlockDialogOpen(true);
        setMenuAnchor(null); // close menu, keep selectedPassenger
    };

    const handleDeleteClick = () => {
        setDeleteDialogOpen(true);
        setMenuAnchor(null); // close menu, keep selectedPassenger
    };

    const handleConfirmDelete = () => {
        if (!selectedPassenger) return;

        deletePassenger({
            variables: {
                input: {
                    passengerId: selectedPassenger.id
                }
            }
        });
    };
    const passengers: PassengerListItem[] = data?.getPassengers?.data ?? [];
    const total = data?.getPassengers?.pagination?.total ?? 0;
    const selectedPassenger = passengers.find((d) => d.id === selectedId);
    const handleTabChange = (_: React.SyntheticEvent, value: string) => {
        setTab(value);
        setPage(0);
    };

    const openMenu = (e: MouseEvent<HTMLElement>, passenger: PassengerListItem) => {
        setMenuAnchor(e.currentTarget);
        setSelectedId(passenger.id);
    };

    const closeMenu = () => {
        setMenuAnchor(null);
        // NOTE: don't clear selectedPassenger here — dialogs opened from this menu
        // need it. selectedPassenger is cleared explicitly in each dialog's onClose.
    };

    return (
        <Card sx={{ p: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <TextField
                    placeholder="Search passenger..."
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
                    variant="scrollable"
                    scrollButtons="auto"
                    allowScrollButtonsMobile
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
                                <TableCell>Passenger</TableCell>
                                <TableCell>Phone</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Trips</TableCell>
                                <TableCell>Rating</TableCell>
                                <TableCell>Spending</TableCell>
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
                                passengers.map((passenger) => (
                                    <TableRow
                                        key={passenger.id}
                                        hover
                                        onClick={() => handleRowClick(passenger.id)}
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        <TableCell>
                                            <Stack direction="row" spacing={1.5} alignItems="center">
                                                <Avatar src={passenger.profileImage} sx={{ width: 36, height: 36 }}>
                                                    {passenger.fullName?.[0]}
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="subtitle2">{passenger.fullName}</Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        ID · {passenger.id.slice(-4)}
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                        </TableCell>
                                        <TableCell>{passenger.phone}</TableCell>
                                        <TableCell>
                                            <UserStatusChip status={passenger.suspended ? 'BLOCKED' : passenger.status} />
                                        </TableCell>
                                        <TableCell>{passenger.totalTripsAsPassenger || '—'}</TableCell>
                                        <TableCell>
                                            {passenger.rating ? (
                                                <Stack direction="row" spacing={0.5} alignItems="center">
                                                    <Rating value={passenger.rating} precision={0.1} readOnly size="small" />
                                                    <Typography variant="body2">{passenger.rating.toFixed(1)}</Typography>
                                                </Stack>
                                            ) : (
                                                '—'
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {passenger.totalSpendingOnRides ? (
                                                <Typography color="success.main" fontWeight={600}>
                                                    Rs. {passenger.totalSpendingOnRides.toLocaleString()}
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
                                                    openMenu(e, passenger);
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
                userName={selectedPassenger?.fullName}
                loading={deleting}
                onClose={() => {
                    setDeleteDialogOpen(false);
                    setSelectedId(null);
                }}
                onConfirm={handleConfirmDelete}
            />
            {blockDialogOpen && selectedPassenger && (
                <BlockUnblockPassengerDialog passenger={selectedPassenger} onClose={closeDialog} refetch={refetch} />
            )}
            {/* Menu itself has NO onClick — only individual MenuItems trigger actions */}
            <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={closeMenu}>
                <MenuItem onClick={handleBlockClick}>
                    <ListItemIcon>
                        <BlockIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>{selectedPassenger?.suspended ? 'Unblock' : 'Block'}</ListItemText>
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

export default PassengerList;
