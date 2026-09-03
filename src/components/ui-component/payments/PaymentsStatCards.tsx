import { Grid, Skeleton } from '@mui/material';
import { IconCoin, IconWallet, IconUsers, IconArrowsExchange, IconBellDollar } from '@tabler/icons-react';
import StatCard from './StatCard';
import { usePaymentsSummary } from 'graphql/queries/payments.queries';
import { useUrlParams } from 'hooks/useSearchParams';
import { DEFAULT_END_DATE, DEFAULT_FROM_DATE } from 'utils/payments.utils';
import { gridSpacing } from 'store/constant';
import { useTheme } from '@mui/material/styles';
import { FaDollarSign } from 'react-icons/fa6';
const formatCurrency = (value: number) => `Rs. ${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function PaymentsStatCards() {
    const { getParam } = useUrlParams();
    const theme = useTheme();
    const { data, loading } = usePaymentsSummary();
    const summary = data?.paymentsSummary;

    if (loading && !summary) {
        return (
            <Grid container spacing={gridSpacing}>
                {[0, 1, 2, 3].map((i) => (
                    <Grid item xs={12} sm={6} md={3} key={i}>
                        <Skeleton variant="rounded" height={120} />
                    </Grid>
                ))}
            </Grid>
        );
    }

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={2} sm={6} md={3}>
                <StatCard
                    title="Total Commission"
                    value={formatCurrency(summary?.totalCommission.value ?? 0)}
                    // percentChange={summary?.totalCommission.percentChange}
                    // isIncrease={summary?.totalCommission.isIncrease}
                    caption="This period"
                    icon={<FaDollarSign size={32} color={theme.palette.success.main} />}
                />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <StatCard
                    title="Driver Wallet Balance"
                    value={formatCurrency(summary?.driverWalletBalance.value ?? 0)}
                    caption="Total balance in driver wallets"
                    icon={<IconWallet size={32} color="#8B5CF6" />}
                />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <StatCard
                    title="Customer Wallet Balance"
                    value={formatCurrency(summary?.customerWalletBalance.value ?? 0)}
                    caption="Total balance in customer wallets"
                    icon={<IconUsers size={32} color="#3B82F6" />}
                />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <StatCard
                    title="Total Transactions"
                    value={(summary?.totalTransactions.value ?? 0).toLocaleString('en-IN')}
                    // percentChange={summary?.totalTransactions.percentChange}
                    // isIncrease={summary?.totalTransactions.isIncrease}
                    caption="All payment transactions"
                    icon={<IconArrowsExchange size={32} color={theme.palette.warning.main} />}
                />
            </Grid>
        </Grid>
    );
}
