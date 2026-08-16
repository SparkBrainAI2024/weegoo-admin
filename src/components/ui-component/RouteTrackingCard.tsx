import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import RouteIcon from '@mui/icons-material/AltRoute';
import { RideDetail } from 'graphql/queries/rides.queries';
import RideDetailTitle from './RideDetailTitle';

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
                <RouteIcon fontSize="small" color="success" />
                <RideDetailTitle title="Route Tracking"></RideDetailTitle>
            </Stack>

            {/* Map integration not wired yet — placeholder until we pick a maps provider */}
            <Box
                sx={{
                    height: 220,
                    borderRadius: 1,
                    bgcolor: 'grey.100',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2
                }}
            >
                <Typography variant="caption" color="text.secondary">
                    Map view coming soon
                </Typography>
            </Box>

            <Stack spacing={1.5} mb={2}>
                <Stack direction="row" spacing={1.5}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'success.main', mt: 0.6 }} />
                    <Box>
                        <Typography variant="caption" color="text.secondary" fontWeight={600}>
                            PICKUP LOCATION
                        </Typography>
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
                        <Typography variant="caption" color="text.secondary" fontWeight={600}>
                            DROP-OFF LOCATION
                        </Typography>
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
                    <Typography variant="caption" color="text.secondary" display="block">
                        DISTANCE
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                        {ride.distanceInKm != null ? `${ride.distanceInKm} km` : '—'}
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary" display="block">
                        DURATION
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                        {ride.durationInMinutes != null ? `${ride.durationInMinutes} min` : '—'}
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary" display="block">
                        WAIT TIME
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                        {ride.waitTimeInMinutes != null ? `${ride.waitTimeInMinutes} min` : '—'}
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary" display="block">
                        VEHICLE TYPE
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                        {ride.vehicle?.vehicleType || '—'}
                    </Typography>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default RouteTrackingCard;
