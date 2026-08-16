import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ScheduleIcon from '@mui/icons-material/Schedule';
import RideDetailTitle from './RideDetailTitle';

// Timeline has no backing schema field yet (RideStatusHistory not modeled) —
// kept static per earlier decision. Revisit once that migration happens.
const STATIC_TIMELINE_STEPS = [
    { label: 'Ride requested by rider' },
    { label: 'Driver accepted the ride' },
    { label: 'Driver arrived at pickup' },
    { label: 'Ride started' },
    { label: 'Ride completion' }
];

const RideTimelineCard = () => {
    return (
        <Paper variant="outlined" sx={{ p: 2.5 }}>
            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                <ScheduleIcon fontSize="small" color="warning" />
                <RideDetailTitle title="Ride Timeline"></RideDetailTitle>
            </Stack>

            <Stack spacing={2}>
                {STATIC_TIMELINE_STEPS.map((step, index) => (
                    <Stack direction="row" spacing={1.5} key={step.label}>
                        <Box
                            sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                bgcolor: 'success.main',
                                mt: 0.7,
                                flexShrink: 0
                            }}
                        />
                        <Box>
                            <Typography variant="body2" fontWeight={600}>
                                {step.label}
                            </Typography>
                        </Box>
                    </Stack>
                ))}
            </Stack>
        </Paper>
    );
};

export default RideTimelineCard;
