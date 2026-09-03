import { Grid, Typography, Box } from '@mui/material';
import { gridSpacing } from 'store/constant';
import PaymentsStatCards from './PaymentsStatCards';
import CommissionOverviewCard from './CommissionOverviewCard';
import WalletBalancesCard from './WalletBalancesCard';
import TopupWithdrawalCard from './TopupWithdrawalCard';
import RecentTransactionsTable from './RecentTransactionsTable';
import PendingWithdrawalsCard from './PendingWithdrawalsCard';
export default function PaymentsDashboard() {
    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h3">Payments</Typography>
                </Box>
            </Grid>

            <Grid item xs={12}>
                <PaymentsStatCards />
            </Grid>

            <Grid item xs={12} md={4}>
                <CommissionOverviewCard />
            </Grid>
            <Grid item xs={12} md={4}>
                <WalletBalancesCard />
            </Grid>
            <Grid item xs={12} md={4}>
                <TopupWithdrawalCard />
            </Grid>

            <Grid item xs={12} md={8}>
                <RecentTransactionsTable />
            </Grid>
            <Grid item xs={12} md={4}>
                <PendingWithdrawalsCard />
            </Grid>
        </Grid>
    );
}
