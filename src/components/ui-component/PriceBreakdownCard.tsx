import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { FareInfo, PaymentDetailsInfo } from 'graphql/queries/rides.queries';
import RideDetailTitle from './RideDetailTitle';
import { Icon, useTheme } from '@mui/material';
import PriceBreakdownIcon from '../../assets/images/icons/price_dark.png';

interface PricingBreakdownCardProps {
    fare?: FareInfo;
    paymentDetails?: PaymentDetailsInfo;
    platformCommissionAmount?: number;
    driverEarningsAmount?: number;
}

const formatCurrency = (amount?: number) => (amount != null ? `Rs. ${amount.toLocaleString('en-IN')}` : '—');

const Row = ({ label, value, bold = false }: { label: string; value: string; bold?: boolean }) => (
    <Stack direction="row" justifyContent="space-between">
        <Typography variant="body2" color={bold ? 'text.primary' : 'text.secondary'} fontWeight={bold ? 700 : 400}>
            {label}
        </Typography>
        <Typography variant="body2" fontWeight={bold ? 700 : 500}>
            {value}
        </Typography>
    </Stack>
);

const PricingBreakdownCard = ({ fare, paymentDetails, platformCommissionAmount, driverEarningsAmount }: PricingBreakdownCardProps) => {
    // fare and paymentDetails overlap significantly (both have baseAmount/distanceAmount/totalAmount) —
    // using paymentDetails as source of truth per the Rides List convention, falling back to fare.
    const totalAmount = paymentDetails?.totalAmount ?? fare?.totalAmount;
    const theme = useTheme();
    return (
        <Paper variant="outlined" sx={{ p: 2.5 }}>
            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                <Icon>
                    <img src={PriceBreakdownIcon} alt="Route tracking" width="26px" />
                </Icon>
                <RideDetailTitle title="Pricing Breakdown"></RideDetailTitle>
            </Stack>
            <Stack spacing={1.25}>
                <Row label="Base Fare" value={formatCurrency(fare?.baseAmount)} />
                <Row label="Distance" value={formatCurrency(fare?.distanceAmount)} />
                {/* No separate "time-based" fare field in schema — trafficCongestionAmount shown instead */}
                <Row label="Traffic / Congestion" value={formatCurrency(fare?.trafficCongestionAmount)} />
                {fare?.discountAmount ? (
                    <Row
                        label={`Discount${fare.promoCodeName ? ` (${fare.promoCodeName})` : ''}`}
                        value={`- ${formatCurrency(fare.discountAmount)}`}
                    />
                ) : null}

                <Divider sx={{ my: 0.5 }} />
                <Row label="Total Amount" value={formatCurrency(totalAmount)} bold />
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Stack spacing={1.25}>
                <Row
                    label={`Platform Commission (${paymentDetails?.driverCommission != null ? `${paymentDetails.driverCommission * 100}%` : '—'})`}
                    value={formatCurrency(platformCommissionAmount)}
                />
                <Row label="Driver Earnings" value={formatCurrency(driverEarningsAmount)} />
            </Stack>
        </Paper>
    );
};

export default PricingBreakdownCard;
