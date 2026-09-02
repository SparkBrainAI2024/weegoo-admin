import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { RideDetail } from 'graphql/queries/rides.queries';
import RideDetailTitle from './RideDetailTitle';
import RouteTrackingIcon from '../../assets/images/icons/route_tracking.png';
import { Icon } from '@mui/material';
import { FieldAndFieldValue, RideDetailSubtitle2 } from './RideDetailSubtitle';
import DriverTrackingMap from './DriverTrackingMap';
// import DriverTrackingMap from './DriverTrackingMap';

const ABLY_KEY = import.meta.env.VITE_ABLY_KEY as string | undefined;
interface RouteTrackingCardProps {
    ride: RideDetail;
}

const formatTime = (iso?: string) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};

const RouteTrackingCard = ({ ride }: RouteTrackingCardProps) => {
    return (
        <Paper variant="outlined" sx={{ p: 2.5 }}>
            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                <Icon>
                    <img src={RouteTrackingIcon} alt="Route tracking" width="26px" />
                </Icon>
                <RideDetailTitle title="Route Tracking"></RideDetailTitle>
            </Stack>

            <Box sx={{ mb: 2 }}>
                <DriverTrackingMap
                    rideId={ride.id}
                    ablyKey={ABLY_KEY}
                    driverId={'6a5b57f1b7e3ec6040e0469b'}
                    height={400}
                    pickupLocation={{
                        lat: 27.66627,
                        lng: 85.43459,
                        address: 'Hanuman Petrol Pump'
                    }}
                    dropoffLocation={{
                        lat: 27.68966,
                        lng: 85.334,
                        address: 'New Baneswor'
                    }}
                />
            </Box>

            <Stack spacing={1.5} mb={2}>
                <Stack direction="row" spacing={1.5}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'success.main', mt: 0.6 }} />
                    <Box>
                        <RideDetailSubtitle2 label="PICKUP LOCATION"></RideDetailSubtitle2>
                        <Typography variant="body2" fontWeight={600}>
                            {ride.pickupLocation?.fullAddress || ride.pickupLocation?.address || '—'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {formatTime(ride.bookingTime)}
                        </Typography>
                    </Box>
                </Stack>

                <Stack direction="row" spacing={1.5}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'error.main', mt: 0.6 }} />
                    <Box>
                        <RideDetailSubtitle2 label="DROP-OFF LOCATION"></RideDetailSubtitle2>
                        <Typography variant="body2" fontWeight={600}>
                            {ride.dropoffLocation?.fullAddress || ride.dropoffLocation?.address || '—'}
                        </Typography>
                        {/* "Expected" time isn't a stored field — showing completed time if the ride finished */}
                        <Typography variant="caption" color="text.secondary">
                            {ride.rideCompletedAt ? formatTime(ride.rideCompletedAt) : 'Expected — not tracked yet'}
                        </Typography>
                    </Box>
                </Stack>
            </Stack>

            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <FieldAndFieldValue
                        label="DISTANCE"
                        value={ride.distanceInKm != null ? `${ride.distanceInKm} km` : '—'}
                    ></FieldAndFieldValue>
                </Grid>
                <Grid item xs={6}>
                    <FieldAndFieldValue
                        label="DURATION"
                        value={ride.durationInMinutes != null ? `${ride.durationInMinutes} min` : '—'}
                    ></FieldAndFieldValue>
                </Grid>
                <Grid item xs={6}>
                    <FieldAndFieldValue
                        label="WAIT TIME"
                        value={ride.waitTimeInMinutes != null ? `${ride.waitTimeInMinutes} min` : '—'}
                    ></FieldAndFieldValue>
                </Grid>
                <Grid item xs={6}>
                    <FieldAndFieldValue label="VEHICLE TYPE" value={ride.vehicle?.vehicleType || '—'}></FieldAndFieldValue>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default RouteTrackingCard;
