import { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Card,
    Chip,
    Grid,
    InputAdornment,
    MenuItem,
    Select,
    Stack,
    TablePagination,
    TextField,
    Typography
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useLazyQuery } from '@apollo/client/react';

import { useDebounce } from 'hooks/useDebounce';
import { Column, DataTable } from 'components/ui-component/DataTable';
import { GetRiderTripsQueryResult, TripListItem } from 'types/passengers.types';
import { GET_RIDER_TRIPS } from 'graphql/queries/passenger.queries';
import { StatCard } from './offers';
import { DualStatCard } from 'components/ui-component/stat-card';

const STATUS_OPTIONS = ['All Status', 'COMPLETED', 'CANCELLED', 'ONGOING'];
const DEFAULT_LIMIT = 10;

interface Props {
    riderId: string;
}

const RiderTripsTab = ({ riderId }: Props) => {
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(DEFAULT_LIMIT);
    const [searchInput, setSearchInput] = useState('');
    const [status, setStatus] = useState('All Status');
    const debouncedSearch = useDebounce(searchInput, 400);

    const [fetchTrips, { data, loading }] = useLazyQuery<GetRiderTripsQueryResult>(GET_RIDER_TRIPS);

    // fires once when this tab first mounts, and again whenever a filter changes
    useEffect(() => {
        fetchTrips({
            variables: {
                input: {
                    riderId,
                    page,
                    limit,
                    search: debouncedSearch || undefined,
                    status: status === 'All Status' ? undefined : status
                }
            }
        });
    }, [riderId, page, limit, debouncedSearch, status, fetchTrips]);

    const trips = data?.getRiderTrips?.data ?? [];
    const summary = data?.getRiderTrips?.summary;
    const total = data?.getRiderTrips?.pagination?.total ?? 0;

    const columns: Column<TripListItem>[] = [
        { key: 'tripId', header: 'Trip ID', render: (row) => row.rideUUId },
        { key: 'date', header: 'Date', render: (row) => new Date(row.createdAt).toLocaleString() },
        { key: 'pickup', header: 'Pickup', render: (row) => row.pickupLocation || '—' },
        { key: 'drop', header: 'Drop', render: (row) => row.dropoffLocation || '—' },
        { key: 'fare', header: 'Fare', render: (row) => `Rs ${row.fare}` },
        { key: 'payment', header: 'Payment', render: (row) => row.paymentMethod || '—' },
        {
            key: 'status',
            header: 'Status',
            render: (row) => (
                <Chip
                    label={row.status}
                    size="small"
                    color={row.status === 'COMPLETED' ? 'success' : row.status === 'CANCELLED' ? 'error' : 'default'}
                    variant="outlined"
                />
            )
        }
    ];

    return (
        <Card sx={{ p: 3 }}>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard label="Total Trips" value={summary?.totalTrips.toString() ?? '-'} chip="Live" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard label="Completed" value={summary?.completed.toString() ?? '-'} chip="Live" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard label="Cancelled" value={summary?.cancelled.toString() ?? '-'} chip="Live" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <DualStatCard
                        firstLabel="Total Spend"
                        firstValue={summary?.totalSpend.toString() ?? '-'}
                        secondLabel="Avg Fare"
                        secondValue={summary?.avgFare.toString() ?? '-'}
                    />
                </Grid>
            </Grid>

            <Stack direction="row" spacing={2} mb={2}>
                <TextField
                    placeholder="Search trip id / route..."
                    size="small"
                    value={searchInput}
                    onChange={(e) => {
                        setSearchInput(e.target.value);
                        setPage(0);
                    }}
                    sx={{ flex: 1 }}
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
                    onChange={(e) => {
                        setStatus(e.target.value);
                        setPage(0);
                    }}
                    sx={{ minWidth: 160 }}
                >
                    {STATUS_OPTIONS.map((s) => (
                        <MenuItem key={s} value={s}>
                            {s}
                        </MenuItem>
                    ))}
                </Select>
                <Button variant="contained">Export Trips</Button>
            </Stack>

            <DataTable columns={columns} rows={trips} loading={loading} getRowKey={(row) => row.id} />

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
        </Card>
    );
};

export default RiderTripsTab;
