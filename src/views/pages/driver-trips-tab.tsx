import { useQuery } from '@apollo/client/react';
import { useState, useEffect } from 'react';
import { Box, Chip, Grid, InputAdornment, MenuItem, Paper, Select, TablePagination, TextField, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Column, DataTable } from 'components/ui-component/DataTable';
import { useDebounce } from 'hooks/useDebounce';
import { useUrlParams } from 'hooks/useSearchParams';
import { DriverTripRow, DriverTripsQuery, DriverTripsQueryVariables, GET_DRIVER_TRIPS } from 'graphql/queries/driver-trips.queries';
import { CommissionSummaryPanel } from 'components/ui-component/CommissionSummaryPanel';

const fmt = (v?: number | null) => (v == null ? '-' : `Rs. ${v}`);

interface Props {
    driverId: string;
}

export const DriverRideHistoryTab = ({ driverId }: Props) => {
    const { getParam, updateParams } = useUrlParams();

    const orderBy = getParam<string>('orderBy', 'createdAt');
    const order = getParam<string>('order', 'desc');
    const search = getParam<string>('search', '');
    const page = getParam<number>('page', 1, Number);
    const limit = 5;

    const [searchInput, setSearchInput] = useState(search);
    const debouncedSearch = useDebounce(searchInput, 400);

    useEffect(() => {
        if (debouncedSearch !== search) {
            updateParams({ search: debouncedSearch }, { resetKeys: ['page'] });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch]);
    const status = getParam<string>('status', '');

    const { data, loading } = useQuery<DriverTripsQuery, DriverTripsQueryVariables>(GET_DRIVER_TRIPS, {
        variables: {
            driverId,
            page: page - 1,
            limit,
            search: debouncedSearch,
            status: status || undefined,
            orderBy,
            order
        }
    });

    const rows = data?.driverTrips?.data ?? [];
    const pagination = data?.driverTrips?.pagination;

    const setSort = (value: string) => {
        const [field, dir] = value.split(':');
        updateParams({ orderBy: field, order: dir }, { resetKeys: ['page'] });
    };

    const setPage = (value: number) => updateParams({ page: value });
    const setStatus = (value: string) => updateParams({ status: value }, { resetKeys: ['page'] });
    const columns: Column<DriverTripRow>[] = [
        {
            key: 'trip',
            header: 'Trip',
            width: '26%',
            render: (row) => (
                <Box>
                    <Box fontWeight={600}>{row.rideUUId}</Box>
                    <Box fontSize={13} color="text.secondary">
                        {row.pickupLocation} → {row.dropoffLocation}
                    </Box>
                </Box>
            )
        },
        {
            key: 'createdAt',
            header: 'Date',
            width: '13%',
            render: (row) =>
                new Date(row.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: '2-digit',
                    year: 'numeric'
                })
        },
        {
            key: 'fare',
            header: 'Fare',
            width: '11%',
            render: (row) => fmt(row.fare)
        },
        {
            key: 'paymentMethod',
            header: 'Payment',
            width: '11%',
            render: (row) => row.paymentMethod ?? '-'
        },
        {
            key: 'driverCommission',
            header: 'Commission',
            width: '13%',
            render: (row) => fmt(row.driverCommission)
        },
        {
            key: 'driverGets',
            header: 'Driver Gets',
            width: '13%',
            render: (row) => fmt(row.driverGets)
        },
        {
            key: 'status',
            header: 'Status',
            width: '13%',
            render: (row) =>
                row.status ? (
                    <Chip
                        size="small"
                        label={row.status}
                        color={row.status === 'COMPLETED' ? 'success' : 'warning'}
                        variant="outlined"
                        sx={{ fontSize: 11, whiteSpace: 'nowrap' }}
                    />
                ) : (
                    '-'
                )
        }
    ];
    return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={8.5}>
                <Paper variant="outlined" sx={{ p: 2.5 }}>
                    <Typography sx={{ fontSize: 12, fontWeight: 400, color: '#2A2A2A' }}>Ride History</Typography>
                    <Typography sx={{ fontSize: 11, fontWeight: 400, color: '#6F6F6E', mb: 1.5 }}>
                        View completed rides and commission collected from each trip
                    </Typography>

                    <Box display="flex" gap={1.5} mb={1.5}>
                        <TextField
                            placeholder="Search by Trip ID, Pickup, Dropoff..."
                            size="small"
                            fullWidth
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon fontSize="small" color="disabled" />
                                    </InputAdornment>
                                ),
                                sx: { fontSize: 12 }
                            }}
                        />
                        <Select
                            size="small"
                            value={status}
                            displayEmpty
                            onChange={(e) => setStatus(e.target.value)}
                            sx={{ minWidth: 120, fontSize: 12 }}
                        >
                            <MenuItem value="" sx={{ fontSize: 12 }}>
                                All Types
                            </MenuItem>
                            <MenuItem value="COMPLETED" sx={{ fontSize: 12 }}>
                                Completed
                            </MenuItem>
                            <MenuItem value="CANCELLED" sx={{ fontSize: 12 }}>
                                Cancelled
                            </MenuItem>
                        </Select>
                        <Select
                            size="small"
                            value={`${orderBy}:${order}`}
                            onChange={(e) => setSort(e.target.value)}
                            sx={{ minWidth: 140, fontSize: 12 }}
                        >
                            <MenuItem value="createdAt:desc" sx={{ fontSize: 12 }}>
                                Newest First
                            </MenuItem>
                            <MenuItem value="createdAt:asc" sx={{ fontSize: 12 }}>
                                Oldest First
                            </MenuItem>
                        </Select>
                    </Box>

                    <Box
                        sx={{
                            '& .MuiTableCell-root': { fontSize: 12, py: 1 },
                            '& .MuiTableCell-head': { fontSize: 11, fontWeight: 600, color: 'text.secondary' }
                        }}
                    >
                        <DataTable columns={columns} rows={rows} getRowKey={(row) => row.id} loading={loading} />
                    </Box>

                    <TablePagination
                        component="div"
                        count={pagination?.total ?? 0}
                        page={page - 1}
                        onPageChange={(_, newPage) => setPage(newPage + 1)}
                        rowsPerPage={limit}
                        rowsPerPageOptions={[limit]}
                        sx={{ '& .MuiTablePagination-toolbar': { minHeight: 40, fontSize: 12 } }}
                    />
                </Paper>
            </Grid>
            <Grid item xs={12} md={3.5}>
                <CommissionSummaryPanel driverId={driverId} />
            </Grid>
        </Grid>
    );
};
