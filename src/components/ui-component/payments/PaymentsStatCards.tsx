import { Grid, Skeleton } from '@mui/material';
import { IconCoin, IconWallet, IconUsers, IconArrowsExchange } from '@tabler/icons-react';
import StatCard from './StatCard';
import { usePaymentsSummary } from 'graphql/queries/payments.queries';
import { useUrlParams } from 'hooks/useSearchParams';

const formatCurrency = (value: number) => `Rs. ${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function PaymentsStatCards() {
    const { getParam } = useUrlParams();

    const fromDate = getParam('fromDate', '');
    const endDate = getParam('endDate', '');
    const { data, loading } = usePaymentsSummary(fromDate, endDate);
    const summary = data?.paymentsSummary;

    if (loading && !summary) {
        return (
            <Grid container spacing={2}>
                {[0, 1, 2, 3].map((i) => (
                    <Grid item xs={12} sm={6} md={3} key={i}>
                        <Skeleton variant="rounded" height={120} />
                    </Grid>
                ))}
            </Grid>
        );
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
                <StatCard
                    title="Total Commission"
                    value={formatCurrency(summary?.totalCommission.value ?? 0)}
                    percentChange={summary?.totalCommission.percentChange}
                    isIncrease={summary?.totalCommission.isIncrease}
                    caption="This period"
                    icon={<IconCoin size={22} />}
                />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <StatCard
                    title="Driver Wallet Balance"
                    value={formatCurrency(summary?.driverWalletBalance.value ?? 0)}
                    caption="Total balance in driver wallets"
                    icon={<IconWallet size={22} />}
                />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <StatCard
                    title="Customer Wallet Balance"
                    value={formatCurrency(summary?.customerWalletBalance.value ?? 0)}
                    caption="Total balance in customer wallets"
                    icon={<IconUsers size={22} />}
                />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <StatCard
                    title="Total Transactions"
                    value={(summary?.totalTransactions.value ?? 0).toLocaleString('en-IN')}
                    percentChange={summary?.totalTransactions.percentChange}
                    isIncrease={summary?.totalTransactions.isIncrease}
                    caption="All payment transactions"
                    icon={<IconArrowsExchange size={22} />}
                />
            </Grid>
        </Grid>
    );
}
