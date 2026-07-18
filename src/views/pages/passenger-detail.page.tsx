import { useState } from 'react';
import { useParams } from 'react-router';
import { Avatar, Box, Button, Card, Chip, Skeleton, Stack, Tab, Tabs, Typography } from '@mui/material';
import { useQuery } from '@apollo/client/react';
import { useUrlParams } from 'hooks/useSearchParams';
import { GetRiderOverviewQueryResult } from 'types/passengers.types';
import { GET_RIDER_OVERVIEW } from 'graphql/queries/passenger.queries';
import RiderOverviewTab from './passenger-overview-tab';
import RiderTripsTab from './passenger-trips-tab';
import RiderRatingsTab from './passenger-ratings-tab';
import { BlockUnblockPassengerDialog } from 'components/ui-component/block-passenger.dialog';

const TABS = [
    { key: 'overview', label: 'Overview' },
    { key: 'trips', label: 'Trips' },
    { key: 'ratings', label: 'Ratings' }
] as const;

const DEFAULT_TAB = 'overview';
type RiderTab = 'overview' | 'trips' | 'ratings';

const PassengerDetailPage = () => {
    const { riderId } = useParams<{ riderId: string }>();
    const { getParam, updateParams } = useUrlParams();
    const tab = getParam<RiderTab>('tab', DEFAULT_TAB);

    const [blockDialogOpen, setBlockDialogOpen] = useState(false);
    // once a tab has been visited we keep it mounted so its lazy query
    // doesn't re-fire every time the admin flips back to it
    const [visitedTabs, setVisitedTabs] = useState<Set<string>>(new Set([DEFAULT_TAB]));

    const { data, loading, refetch } = useQuery<GetRiderOverviewQueryResult>(GET_RIDER_OVERVIEW, {
        variables: { riderId },
        skip: !riderId,
        fetchPolicy: 'cache-and-network'
    });

    const rider = data?.getRiderOverview;

    const handleTabChange = (_: React.SyntheticEvent, value: string) => {
        updateParams({ tab: value === DEFAULT_TAB ? undefined : value });
        setVisitedTabs((prev) => new Set(prev).add(value));
    };

    if (loading && !rider) {
        return (
            <Card sx={{ p: 3 }}>
                <Skeleton variant="text" width={200} height={32} />
                <Skeleton variant="text" width={300} />
            </Card>
        );
    }

    if (!rider) return null;

    return (
        <Box>
            <Card sx={{ p: 3, mb: 2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar src={rider.profileImage} sx={{ width: 48, height: 48 }}>
                            {rider.fullName?.[0]}
                        </Avatar>
                        <Box>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Typography variant="h5">{rider.fullName}</Typography>
                                <Chip
                                    label={rider.suspended ? 'Blocked' : 'Active'}
                                    size="small"
                                    color={rider.suspended ? 'error' : 'success'}
                                    variant="outlined"
                                />
                            </Stack>
                            <Typography variant="body2" color="text.secondary">
                                {rider.phone}
                            </Typography>
                        </Box>
                    </Stack>
                    <Button color={rider.suspended ? 'success' : 'error'} variant="outlined" onClick={() => setBlockDialogOpen(true)}>
                        {rider.suspended ? 'Unblock' : 'Block'}
                    </Button>
                </Stack>

                <Tabs value={tab} onChange={handleTabChange} sx={{ mt: 2 }}>
                    {TABS.map((t) => (
                        <Tab key={t.key} value={t.key} label={t.label} />
                    ))}
                </Tabs>
            </Card>

            {tab === 'overview' && <RiderOverviewTab rider={rider} />}
            {riderId && visitedTabs.has('trips') && (
                <Box sx={{ display: tab === 'trips' ? 'block' : 'none' }}>
                    <RiderTripsTab riderId={riderId} />
                </Box>
            )}
            {riderId && visitedTabs.has('ratings') && (
                <Box sx={{ display: tab === 'ratings' ? 'block' : 'none' }}>
                    <RiderRatingsTab riderId={riderId} />
                </Box>
            )}

            {blockDialogOpen && (
                <></>
                // <BlockUnblockPassengerDialog passenger={rider} onClose={() => setBlockDialogOpen(false)} refetch={refetch} />
            )}
        </Box>
    );
};

export default PassengerDetailPage;
