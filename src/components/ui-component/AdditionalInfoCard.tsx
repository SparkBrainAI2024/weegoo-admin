import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { RideDetail } from 'graphql/queries/rides.queries';
import RideDetailTitle from './RideDetailTitle';
import { FieldAndFieldValue, RideDetailSubtitle } from './RideDetailSubtitle';
import { SpaciousChipContainer } from './SpaciousChipContainer';

interface AdditionalInfoCardProps {
    ride: RideDetail;
}

const PAYMENT_STATUS_COLOR: Record<string, 'success' | 'warning' | 'error' | 'default'> = {
    PAID: 'success',
    PENDING: 'warning',
    FAILED: 'error'
};

const AdditionalInfoCard = ({ ride }: AdditionalInfoCardProps) => {
    const paymentStatus = ride.paymentDetails?.paymentStatus;
    const promoCode = ride.paymentDetails?.promoCodeName ?? ride.fare?.promoCodeName;

    return (
        <Paper variant="outlined" sx={{ p: 2.5 }}>
            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                <RideDetailTitle title="Additional Information"></RideDetailTitle>
            </Stack>

            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <FieldAndFieldValue label="BOOKING ID" value={ride.rideUUId || '—'}></FieldAndFieldValue>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary" display="block"></Typography>
                    <RideDetailSubtitle label="  PAYMENT STATUS"></RideDetailSubtitle>

                    {paymentStatus ? (
                        <SpaciousChipContainer
                            label={paymentStatus.charAt(0) + paymentStatus.slice(1).toLowerCase()}
                            color={PAYMENT_STATUS_COLOR[paymentStatus.toUpperCase()] ?? 'default'}
                        />
                    ) : (
                        <Typography variant="body2">—</Typography>
                    )}
                </Grid>
                <Grid item xs={12}>
                    <FieldAndFieldValue label="PROMO CODE" value={promoCode || '—'}></FieldAndFieldValue>
                </Grid>
                <Grid item xs={12}>
                    <RideDetailSubtitle label="NOTES"></RideDetailSubtitle>
                    {/* No notes field on Rides schema yet — static placeholder per earlier decision */}
                    <Typography variant="body3" sx={{ letterSpacing: 0, fontWeight: 400 }}>
                        No additional notes for this ride.
                    </Typography>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default AdditionalInfoCard;
