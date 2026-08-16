import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import PersonIcon from '@mui/icons-material/Person';
import StarIcon from '@mui/icons-material/Star';
import { RideUserSnapshotInfo } from 'graphql/queries/rides.queries';
import { Box } from '@mui/material';
import RideDetailTitle from './RideDetailTitle';

interface RiderInformationCardProps {
    passenger?: RideUserSnapshotInfo;
    onOpenProfile?: (userId: string, role: 'DRIVER' | 'PASSENGER') => void;
}

const RiderInformationCard = ({ passenger, onOpenProfile }: RiderInformationCardProps) => {
    if (!passenger) return null;

    return (
        <Paper variant="outlined" sx={{ p: 2.5 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <PersonIcon fontSize="small" color="success" />
                    <RideDetailTitle title="Rider Information"></RideDetailTitle>
                </Stack>
                <Button size="small" onClick={() => onOpenProfile?.(passenger.userId, 'PASSENGER')}>
                    View
                </Button>
            </Stack>

            <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                <Avatar src={passenger.profileImage} sx={{ width: 48, height: 48 }}>
                    {passenger.fullName?.charAt(0)}
                </Avatar>
                <Box>
                    <Typography variant="body1" fontWeight={700}>
                        {passenger.fullName}
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Stack direction="row" alignItems="center" spacing={0.3}>
                            <StarIcon sx={{ fontSize: 14, color: 'warning.main' }} />
                            <Typography variant="caption">{passenger.rating?.toFixed(1) ?? '—'}</Typography>
                        </Stack>
                        <Typography variant="caption" color="text.secondary">
                            · {passenger.totalTripsAsPassenger ?? 0} rides · {passenger.displayId}
                        </Typography>
                    </Stack>
                </Box>
            </Stack>

            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary" display="block">
                        PHONE
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                        {passenger.phone || '—'}
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary" display="block">
                        EMAIL
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                        {passenger.email || '—'}
                    </Typography>
                </Grid>
                {/* Payment method & special requests aren't on RideUserSnapshotInfo —
                    payment method lives on paymentDetails, not the passenger; special
                    requests has no schema field at all yet. */}
            </Grid>
        </Paper>
    );
};

export default RiderInformationCard;
