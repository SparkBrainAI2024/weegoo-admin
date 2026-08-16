import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import ScheduleIcon from '@mui/icons-material/Schedule';

// Timeline has no backing schema field yet (RideStatusHistory not modeled) —
// kept static per earlier decision. Revisit once that migration happens.
const STATIC_TIMELINE_STEPS = [
    { time: '2:45 PM', label: 'Ride requested by rider' },
    { time: '2:46 PM', label: 'Driver accepted the ride' },
    { time: '2:48 PM', label: 'Driver arrived at pickup' },
    { time: '2:51 PM', label: 'Ride started' },
    { time: '3:21 PM (Expected)', label: 'Ride completion' }
];

const RideTimelineCard = () => {
    return (
        <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
            <Stack direction="row" alignItems="center" spacing={1.5} mb={1.5}>
                <Box
                    sx={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        bgcolor: 'warning.dark',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <ScheduleIcon sx={{ fontSize: 16, color: 'common.white' }} />
                </Box>
                <Typography variant="subtitle1" fontWeight={700}>
                    Ride Timeline
                </Typography>
            </Stack>

            <Divider sx={{ mb: 2 }} />

            <Stack>
                {STATIC_TIMELINE_STEPS.map((step, index) => {
                    const isLast = index === STATIC_TIMELINE_STEPS.length - 1;
                    return (
                        <Stack direction="row" spacing={2} key={step.label}>
                            {/* dot + connecting line column */}
                            <Stack alignItems="center" sx={{ width: 12 }}>
                                <Box
                                    sx={{
                                        width: 10,
                                        height: 10,
                                        borderRadius: '50%',
                                        bgcolor: 'success.main',
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
                                <Typography variant="body1" fontWeight={700}>
                                    {step.time}
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
