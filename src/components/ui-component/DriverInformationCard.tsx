import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import StarIcon from '@mui/icons-material/Star';
import { RideUserSnapshotInfo, VehicleInfo } from 'graphql/queries/rides.queries';
import RideDetailTitle from './RideDetailTitle';
import { FieldAndFieldValue } from './RideDetailSubtitle';

interface DriverInformationCardProps {
    driver?: RideUserSnapshotInfo;
    vehicle?: VehicleInfo;
    onOpenProfile?: (userId: string, role: 'DRIVER' | 'PASSENGER') => void;
}

const DriverInformationCard = ({ driver, vehicle, onOpenProfile }: DriverInformationCardProps) => {
    if (!driver) return null;

    return (
        <Paper variant="outlined" sx={{ p: 2.5 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <DirectionsCarIcon fontSize="small" color="success" />
                    <RideDetailTitle title="Driver Information"></RideDetailTitle>
                </Stack>
                <Button size="small" onClick={() => onOpenProfile?.(driver.userId, 'DRIVER')}>
                    View
                </Button>
            </Stack>

            <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                <Avatar src={driver.profileImage} sx={{ width: 48, height: 48 }}>
                    {driver.fullName?.charAt(0)}
                </Avatar>
                <Box>
                    <Typography variant="body1" fontWeight={700}>
                        {driver.fullName}
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Stack direction="row" alignItems="center" spacing={0.3}>
                            <StarIcon sx={{ fontSize: 14, color: 'warning.main' }} />
                            <Typography variant="caption">{driver.rating?.toFixed(1) ?? '—'}</Typography>
                        </Stack>
                        <Typography variant="caption" color="text.secondary">
                            · {driver.totalRidesAsDriver ?? 0} rides · {driver.displayId}
                        </Typography>
                    </Stack>
                </Box>
            </Stack>

            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <FieldAndFieldValue label="PHONE" value={driver.phone || '—'}></FieldAndFieldValue>
                </Grid>
                <Grid item xs={6}>
                    <FieldAndFieldValue
                        label="VEHICLE"
                        value={vehicle ? `${vehicle.name ?? ''} ${vehicle.vehicleModel ?? ''}`.trim() || '—' : '—'}
                    ></FieldAndFieldValue>
                </Grid>
                <Grid item xs={6}>
                    <FieldAndFieldValue label="LICENSE PLATE" value={vehicle?.numberPlate || '—'}></FieldAndFieldValue>
                </Grid>
                <Grid item xs={6}>
                    <FieldAndFieldValue label="VEHICLE COLOR" value={vehicle?.color || '—'}></FieldAndFieldValue>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default DriverInformationCard;
