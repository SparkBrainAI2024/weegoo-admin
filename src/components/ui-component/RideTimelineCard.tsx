import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import RideTimelineIcon from '../../assets/images/icons/ride_timeline.png';
import { Icon } from '@mui/material';
import RideDetailTitle from './RideDetailTitle';
import { formatNepalTime } from 'utils/date';
// Timeline has no backing schema field yet (RideStatusHistory not modeled) —
// kept static per earlier decision. Revisit once that migration happens.

interface RideTimelineCardProps {
    bookingTime: string | null;
    rideStartedAt: string | null;
    rideCompletedAt: string | null;
}

const RideTimelineCard = ({ bookingTime, rideStartedAt, rideCompletedAt }: RideTimelineCardProps) => {
    const timelineSteps = [
        {
            time: bookingTime,
            label: 'Ride requested by rider'
        },
        {
            time: rideStartedAt,
            label: 'Ride started'
        },
        {
            time: rideCompletedAt,
            label: 'Ride completed'
        }
    ];
    return (
        <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
            <Stack direction="row" alignItems="center" spacing={1.5} mb={1.5}>
                <Icon>
                    <img src={RideTimelineIcon} alt="Ride_Timeline" width="26px" />
                </Icon>

                <RideDetailTitle title="Ride Timeline"></RideDetailTitle>
            </Stack>

            <Divider sx={{ mb: 2 }} />

            <Stack>
                {timelineSteps.map((step, index) => {
                    const isLast = index === timelineSteps.length - 1;
                    return (
                        <Stack direction="row" spacing={2} key={step.label}>
                            {/* dot + connecting line column */}
                            <Stack alignItems="center" sx={{ width: 12 }}>
                                <Box
                                    sx={{
                                        width: 10,
                                        height: 10,
                                        borderRadius: '50%',
                                        bgcolor: !step?.time ? 'grey.300' : 'success.main',
                                        flexShrink: 0,
                                        mt: 0.6
                                    }}
                                />
                                {!isLast && (
                                    <Box
                                        sx={{
                                            width: '2px',
                                            flexGrow: 1,
                                            minHeight: 40,
                                            bgcolor: 'grey.300'
                                        }}
                                    />
                                )}
                            </Stack>

                            {/* time + label */}
                            <Box sx={{ pb: isLast ? 0 : 3 }}>
                                <Typography variant="body1" sx={{ color: 'text.primary' }}>
                                    {formatNepalTime(step.time)}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {step.label}
                                </Typography>
                            </Box>
                        </Stack>
                    );
                })}
            </Stack>
        </Paper>
    );
};

export default RideTimelineCard;
