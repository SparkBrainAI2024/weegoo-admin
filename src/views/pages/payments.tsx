import { Grid, Typography, Box } from '@mui/material';
import { gridSpacing } from 'store/constant';
import PaymentsStatCards from 'components/ui-component/payments/PaymentsStatCards';
import CommissionOverviewCard from 'components/ui-component/payments/CommissionOverviewCard';
import WalletBalancesCard from 'components/ui-component/payments/WalletBalancesCard';
import TopupWithdrawalCard from 'components/ui-component/payments/TopupWithdrawalCard';
import RecentTransactionsTable from 'components/ui-component/payments/RecentTransactionsTable';
import PendingWithdrawalsCard from 'components/ui-component/payments/PendingWithdrawalsCard';

export default function PaymentsDashboard() {
    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12} sx={{ display: 'flex' }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h3">Payments</Typography>
                </Box>
            </Grid>

            <Grid item xs={12} sx={{ display: 'flex' }}>
                <PaymentsStatCards />
            </Grid>

            <Grid item xs={12} sx={{ display: 'flex' }} md={5}>
                <CommissionOverviewCard />
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex' }} md={3.5}>
                <WalletBalancesCard />
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex' }} md={3.5}>
                <TopupWithdrawalCard />
            </Grid>

            <Grid item xs={12} sx={{ display: 'flex' }} md={8.5}>
                <RecentTransactionsTable />
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex' }} md={3.5}>
                <PendingWithdrawalsCard />
            </Grid>
        </Grid>
    );
}
