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
import { useQuery } from '@apollo/client/react';
import { GET_DRIVERS } from 'graphql/queries/drivers.queries';
import { GetDriversQueryResult } from 'types/drivers-list.response';
import { DriverStatusChip } from 'components/ui-component/drivers/DriverStatusChip';

const TABS = [
    { key: 'ACTIVE', label: 'Active' },
    { key: 'PENDING', label: 'Pending' },
    { key: 'BLOCKED', label: 'Blocked' }
] as const;

export const DriverList = () => {
    const [tab, setTab] = useState<string>('ACTIVE');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10);
    const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
    const [selectedDriver, setSelectedDriver] = useState<DriverListItem | null>(null);

    const debouncedSearch = useDebounce(search, 400);

    const { data, loading } = useQuery<GetDriversQueryResult>(GET_DRIVERS, {
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

    const drivers: DriverListItem[] = data?.getDrivers?.data ?? [];
    const total = data?.getDrivers?.pagination?.total ?? 0;

    const handleTabChange = (_: React.SyntheticEvent, value: string) => {
        setTab(value);
        setPage(0);
    };

    const openMenu = (e: MouseEvent<HTMLElement>, driver: DriverListItem) => {
        setMenuAnchor(e.currentTarget);
        setSelectedDriver(driver);
    };

    const closeMenu = () => {
        setMenuAnchor(null);
        setSelectedDriver(null);
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
                                        >
                                            {/* Replace with real per-status counts once available */}
                                        </Badge>
                                    </Stack>
                                )
                            }
                        />
                    ))}
                </Tabs>
            </Stack>

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
                            <TableRow key={driver.id} hover>
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
                                    <DriverStatusChip status={driver.status} />
                                </TableCell>
                                <TableCell>{driver.totalRides || '—'}</TableCell>
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
                                    <IconButton size="small" onClick={(e) => openMenu(e, driver)}>
                                        <MoreHorizIcon fontSize="small" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>

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

            <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={closeMenu}>
                <MenuItem onClick={closeMenu}>
                    <ListItemIcon>
                        <BlockIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Block</ListItemText>
                </MenuItem>
                <MenuItem onClick={closeMenu} sx={{ color: 'error.main' }}>
                    <ListItemIcon>
                        <DeleteOutlineIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                </MenuItem>
            </Menu>
        </Card>
    );
};
