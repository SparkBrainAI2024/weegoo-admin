import * as React from 'react';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

import { useQuery } from '@apollo/client/react';
import { useNavigate, useParams } from 'react-router';
import { GET_RIDE_DETAIL, GetRideDetailResponse, GetRideDetailVariables } from 'graphql/queries/rides.queries';

import RouteTrackingCard from 'components/ui-component/RouteTrackingCard';
import RideTimelineCard from 'components/ui-component/RideTimelineCard';
import RiderInformationCard from 'components/ui-component/RideInformationCard';
import DriverInformationCard from 'components/ui-component/DriverInformationCard';
import PricingBreakdownCard from 'components/ui-component/PriceBreakdownCard';
import AdditionalInfoCard from 'components/ui-component/AdditionalInfoCard';
import RideStatusCard from 'components/ui-component/RideStatusCard';

const RideDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data, loading, error } = useQuery<GetRideDetailResponse, GetRideDetailVariables>(GET_RIDE_DETAIL, {
        variables: { input: { id: id ?? '' } },
        skip: !id
    });

    const handleOpenProfile = (partyId: string, role: 'DRIVER' | 'PASSENGER') => {
        if (role === 'DRIVER') {
            navigate(`/drivers/${partyId}`);
        } else {
            navigate(`/passengers/${partyId}`);
        }
    };

    if (loading && !data) {
        return (
            <Stack spacing={2.5}>
                <Skeleton variant="rounded" height={64} />
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2.5 }}>
                    <Box sx={{ flex: 2, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                        <Skeleton variant="rounded" height={280} />
                        <Skeleton variant="rounded" height={160} />
                        <Skeleton variant="rounded" height={160} />
                    </Box>
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                        <Skeleton variant="rounded" height={220} />
                        <Skeleton variant="rounded" height={220} />
                        <Skeleton variant="rounded" height={140} />
                    </Box>
                </Box>
            </Stack>
        );
    }

    if (error || !data) {
        return <Alert severity="error">Couldn&apos;t load this ride{error ? `: ${error.message}` : ''}.</Alert>;
    }

    const ride = data.rideDetail;

    return (
        <Stack spacing={2.5}>
            <RideStatusCard status={ride.rideStatus} startedAt={ride.rideStartedAt ?? ride.bookingTime} />

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2.5 }}>
                {/* Left column */}
                <Box sx={{ flex: 2, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    <RouteTrackingCard ride={ride} />
                    <RiderInformationCard passenger={ride.passenger} onOpenProfile={handleOpenProfile} />
                    <DriverInformationCard driver={ride.driver} vehicle={ride.vehicle} onOpenProfile={handleOpenProfile} />
                </Box>

                {/* Right column */}
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    <PricingBreakdownCard
                        fare={ride.fare}
                        paymentDetails={ride.paymentDetails}
                        platformCommissionAmount={ride.platformCommissionAmount}
                        driverEarningsAmount={ride.driverEarningsAmount}
                    />
                    <RideTimelineCard />
                    <AdditionalInfoCard ride={ride} />
                </Box>
            </Box>
        </Stack>
    );
};

export default RideDetailsPage;
