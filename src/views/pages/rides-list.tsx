import { useEffect, useState } from 'react';
import { Box, Button, Chip, MenuItem, Select, TablePagination, TextField, Typography } from '@mui/material';
import { InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';

import { Column, DataTable } from 'components/ui-component/DataTable';
import { useDebounce } from '../../hooks/useDebounce';
import { RideStatus, RideTimeRange, useRidesList } from 'graphql/queries/rides.queries';
import { useUrlParams } from 'hooks/useSearchParams';

const STATUS_COLORS: Record<RideStatus, 'warning' | 'success' | 'error' | 'default'> = {
    [RideStatus.ONGOING]: 'warning',
    [RideStatus.COMPLETED]: 'success',
    [RideStatus.CANCELLED]: 'error',
    [RideStatus.CONFIRMED]: 'default',
    [RideStatus.PICKUP]: 'warning',
    [RideStatus.PENDING]: 'default'
};

const TIME_RANGE_LABELS: Record<RideTimeRange, string> = {
    [RideTimeRange.LAST_24_HOURS]: 'Last 24 Hours',
    [RideTimeRange.LAST_7_DAYS]: 'Last 7 Days',
    [RideTimeRange.LAST_30_DAYS]: 'Last 30 Days'
};

interface RideRow {
    id: string;
    rideUUId: string;
    rideStatus: RideStatus;
    bookingTime: string;
    pickupLocation?: { address?: string };
    dropoffLocation?: { address?: string };
    paymentDetails?: { totalAmount?: number };
    passenger?: { fullName?: string };
    driver?: { fullName?: string };
}

const RidesList = () => {
    const navigate = useNavigate();
    const { getParam, updateParams } = useUrlParams();

    // URL-derived filter/pagination state — single source of truth
    const status = getParam<RideStatus | ''>('status', '');
    const timeRange = getParam<RideTimeRange>('timeRange', RideTimeRange.LAST_24_HOURS);
    const search = getParam<string>('search', '');
    const page = getParam<number>('page', 1, Number);
    const limit = 10;

    // Local input state so typing doesn't rewrite the URL on every keystroke;
    // debounce feeds the URL/query instead.
    const [searchInput, setSearchInput] = useState(search);
    const debouncedSearch = useDebounce(searchInput, 400);

    useEffect(() => {
        if (debouncedSearch !== search) {
            updateParams({ search: debouncedSearch }, { resetKeys: ['page'] });
        }
        // Only re-run when the debounced value changes, not on every `search`/`updateParams` identity change
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch]);

    const { data, loading } = useRidesList({
        page,
        perPage: limit,
        status,
        timeRange,
        search: debouncedSearch
    });

    const rides: RideRow[] = data?.rides?.rides ?? [];
    const total = data?.rides?.total ?? 0;

    const setStatus = (value: RideStatus | '') => updateParams({ status: value }, { resetKeys: ['page'] });

    const setTimeRange = (value: RideTimeRange) => updateParams({ timeRange: value }, { resetKeys: ['page'] });

    const setPage = (value: number) => updateParams({ page: value });

    const columns: Column<RideRow>[] = [
        { key: 'rideId', header: 'RIDE ID', render: (row) => row.rideUUId },
        { key: 'rider', header: 'RIDER', render: (row) => row.passenger?.fullName ?? '—' },
        { key: 'driver', header: 'DRIVER', render: (row) => row.driver?.fullName ?? '—' },
        { key: 'pickup', header: 'PICK UP', render: (row) => row.pickupLocation?.address ?? '—' },
        { key: 'dropoff', header: 'DROP OFF', render: (row) => row.dropoffLocation?.address ?? '—' },
        { key: 'price', header: 'PRICE', render: (row) => `Rs. ${row.paymentDetails?.totalAmount ?? 0}` },
        {
            key: 'time',
            header: 'TIME',
            render: (row) => new Date(row.bookingTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        {
            key: 'status',
            header: 'STATUS',
            render: (row) => <Chip label={row.rideStatus} size="small" color={STATUS_COLORS[row.rideStatus]} sx={{ fontWeight: 600 }} />
        },
        {
            key: 'action',
            header: 'ACTION',
            render: (row) => (
                <Button size="small" variant="contained" color="success" onClick={() => navigate(`/rides/${row.id}`)}>
                    View Details
                </Button>
            )
        }
    ];

    return (
        <Box>
            <Typography variant="h5" fontWeight={600} mb={3}>
                Rides
            </Typography>

            <Box display="flex" gap={2} mb={3}>
                <TextField
                    placeholder="Search by Ride ID, Driver, Rider name...."
                    size="small"
                    fullWidth
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon fontSize="small" color="disabled" />
                            </InputAdornment>
                        )
                    }}
                />
                <Select
                    size="small"
                    value={status}
                    displayEmpty
                    onChange={(e) => setStatus(e.target.value as RideStatus | '')}
                    sx={{ minWidth: 160 }}
                >
                    <MenuItem value="">All Status</MenuItem>
                    {Object.values(RideStatus).map((s) => (
                        <MenuItem key={s} value={s}>
                            {s.charAt(0) + s.slice(1).toLowerCase()}
                        </MenuItem>
                    ))}
                </Select>
                <Select
                    size="small"
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value as RideTimeRange)}
                    sx={{ minWidth: 160 }}
                >
                    {Object.entries(TIME_RANGE_LABELS).map(([value, label]) => (
                        <MenuItem key={value} value={value}>
                            {label}
                        </MenuItem>
                    ))}
                </Select>
            </Box>

            <DataTable columns={columns} rows={rides} loading={loading} getRowKey={(row) => row.id} />

            <TablePagination
                component="div"
                count={total}
                page={page - 1}
                rowsPerPage={limit}
                rowsPerPageOptions={[limit]}
                onPageChange={(_, newPage) => setPage(newPage + 1)}
            />
        </Box>
    );
};

export default RidesList;
