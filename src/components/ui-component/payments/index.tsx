import { useState } from 'react';
import { Grid, MenuItem, Select, Typography, Box } from '@mui/material';
import { gridSpacing } from 'store/constant';
import { PaymentsPeriod } from 'graphql/queries/payments.queries';
import PaymentsStatCards from './PaymentsStatCards';
import CommissionOverviewCard from './CommissionOverviewCard';
import WalletBalancesCard from './WalletBalancesCard';
import TopupWithdrawalCard from './TopupWithdrawalCard';
import RecentTransactionsTable from './RecentTransactionsTable';
import PendingWithdrawalsCard from './PendingWithdrawalsCard';
export default function PaymentsDashboard() {
    const [period, setPeriod] = useState<PaymentsPeriod>(PaymentsPeriod.THIS_MONTH);

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h3">Payments</Typography>
                </Box>
            </Grid>

            <Grid item xs={12}>
                <PaymentsStatCards period={period} />
            </Grid>

            <Grid item xs={12} md={4}>
                <Box display="flex" justifyContent="flex-end" mb={1}>
                    <Select size="small" value={period} onChange={(e) => setPeriod(e.target.value as PaymentsPeriod)}>
                        <MenuItem value={PaymentsPeriod.TODAY}>Today</MenuItem>
                        <MenuItem value={PaymentsPeriod.THIS_WEEK}>This Week</MenuItem>
                        <MenuItem value={PaymentsPeriod.THIS_MONTH}>This Month</MenuItem>
                        <MenuItem value={PaymentsPeriod.THIS_YEAR}>This Year</MenuItem>
                    </Select>
                </Box>
            </Grid>
            <Grid item xs={12} md={8} />

            <Grid item xs={12} md={4}>
                <CommissionOverviewCard period={period} />
            </Grid>
            <Grid item xs={12} md={4}>
                <WalletBalancesCard />
            </Grid>
            <Grid item xs={12} md={4}>
                <TopupWithdrawalCard period={period} />
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
