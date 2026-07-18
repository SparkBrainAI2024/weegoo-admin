import { useEffect, useState } from 'react';
import { Avatar, Box, Card, Chip, Grid, LinearProgress, Rating, Stack, TablePagination, Typography } from '@mui/material';
import { useLazyQuery } from '@apollo/client/react';
import { Column, DataTable } from 'components/ui-component/DataTable';
import { GetRiderRatingsQueryResult, RatingListItem } from 'types/passengers.types';
import { GET_RIDER_RATINGS } from 'graphql/queries/passenger.queries';

const DEFAULT_LIMIT = 10;

interface Props {
    riderId: string;
}

const RiderRatingsTab = ({ riderId }: Props) => {
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(DEFAULT_LIMIT);

    const [fetchRatings, { data, loading }] = useLazyQuery<GetRiderRatingsQueryResult>(GET_RIDER_RATINGS);

    useEffect(() => {
        fetchRatings({ variables: { input: { riderId, page, limit } } });
    }, [riderId, page, limit, fetchRatings]);

    const ratings = data?.getRiderRatings;
    const reviews = ratings?.data ?? [];
    const total = ratings?.pagination?.total ?? 0;
    const breakdown = ratings?.breakdown;

    const starRows = breakdown
        ? [
              { star: 5, count: breakdown.fiveStar },
              { star: 4, count: breakdown.fourStar },
              { star: 3, count: breakdown.threeStar },
              { star: 2, count: breakdown.twoStar },
              { star: 1, count: breakdown.oneStar }
          ]
        : [];
    const maxCount = Math.max(1, ...starRows.map((r) => r.count));

    const columns: Column<RatingListItem>[] = [
        { key: 'rideId', header: 'Ride ID', render: (row) => row.rideUUId },
        {
            key: 'rideInfo',
            header: 'Ride Information',
            render: (row) => (
                <Box>
                    <Typography variant="body2">
                        {row.pickup} → {row.drop}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Fare: Rs. {row.fare}
                    </Typography>
                </Box>
            )
        },
        {
            key: 'driver',
            header: 'Driver',
            render: (row) => (
                <Stack direction="row" spacing={1} alignItems="center">
                    <Avatar sx={{ width: 28, height: 28, fontSize: 12 }}>{row.driverName?.[0]}</Avatar>
                    <Box>
                        <Typography variant="body2">{row.driverName}</Typography>
                        <Typography variant="caption" color="text.secondary">
                            ID: {row.driverShortId}
                        </Typography>
                    </Box>
                </Stack>
            )
        },
        { key: 'date', header: 'Date & Time', render: (row) => new Date(row.createdAt).toLocaleString() },
        { key: 'rating', header: 'Rating', render: (row) => <Rating value={row.rating} precision={0.5} readOnly size="small" /> },
        { key: 'review', header: 'Review', render: (row) => row.review || '—' },
        {
            key: 'feedback',
            header: 'Feedback',
            render: (row) => (
                <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                    {(row.feedbackTags ?? []).map((tag) => (
                        <Chip key={tag} label={tag} size="small" variant="outlined" />
                    ))}
                </Stack>
            )
        }
    ];

    return (
        <Card sx={{ p: 3 }}>
            <Grid container spacing={4} mb={3}>
                <Grid item xs={12} md={3}>
                    <Typography variant="caption" color="text.secondary">
                        Average Rating
                    </Typography>
                    <Typography variant="h2">{ratings?.averageRating?.toFixed(1) ?? '—'}</Typography>
                    <Rating value={ratings?.averageRating ?? 0} precision={0.1} readOnly />
                    <Typography variant="caption" color="text.secondary">
                        ({ratings?.totalReviews ?? 0} reviews)
                    </Typography>
                </Grid>
                <Grid item xs={12} md={9}>
                    <Stack spacing={1}>
                        {starRows.map((row) => (
                            <Stack key={row.star} direction="row" spacing={1} alignItems="center">
                                <Typography variant="body2" sx={{ width: 40 }}>
                                    {row.star} ★
                                </Typography>
                                <LinearProgress
                                    variant="determinate"
                                    value={(row.count / maxCount) * 100}
                                    sx={{ flex: 1, height: 8, borderRadius: 4 }}
                                />
                                <Typography variant="body2" sx={{ width: 40, textAlign: 'right' }}>
                                    {row.count}
                                </Typography>
                            </Stack>
                        ))}
                    </Stack>
                </Grid>
            </Grid>

            <Typography variant="subtitle1" fontWeight={600} mb={1}>
                Ratings List
            </Typography>

            <Box sx={{ overflowX: 'auto' }}>
                <Box sx={{ minWidth: 1200 }}>
                    <DataTable columns={columns} rows={reviews} loading={loading} getRowKey={(row: any) => row.rideId} />
                </Box>
            </Box>

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

export default RiderRatingsTab;
