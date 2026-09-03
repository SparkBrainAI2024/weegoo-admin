import { useTheme } from '@mui/material/styles';
import { Box, Grid, Skeleton, Typography } from '@mui/material';
import Chart from 'react-apexcharts';
import { useWalletBalances } from 'graphql/queries/payments.queries';
import MainCard from '../cards/MainCard';

const formatCurrency = (value: number) => `Rs. ${value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

export default function WalletBalancesCard() {
    const theme = useTheme();
    const { data, loading } = useWalletBalances();
    const balances = data?.walletBalances;

    const segments = [
        {
            key: 'driver',
            label: balances?.driverWallet.label ?? 'Driver Wallet Balance',
            value: balances?.driverWallet.value ?? 0,
            percentage: balances?.driverWallet.percentage ?? 0,
            color: theme.palette.secondary.main
        },
        {
            key: 'customer',
            label: balances?.customerWallet.label ?? 'Customer Wallet Balance',
            value: balances?.customerWallet.value ?? 0,
            percentage: balances?.customerWallet.percentage ?? 0,
            color: theme.palette.primary.main
        },
        {
            key: 'commission',
            label: balances?.commission.label ?? 'Commission',
            value: balances?.commission.value ?? 0,
            percentage: balances?.commission.percentage ?? 0,
            color: theme.palette.success.dark
        }
    ];

    const chartOptions: ApexCharts.ApexOptions = {
        chart: { type: 'donut' },
        labels: segments.map((s) => s.label),
        colors: segments.map((s) => s.color),
        legend: { show: false },
        dataLabels: { enabled: false },
        plotOptions: { pie: { donut: { size: '75%', labels: { show: false } } } },
        stroke: { width: 0 }
    };

    const series = segments.map((s) => s.value);

    return (
        <MainCard
            title="Wallet Balances"
            sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}
            contentSX={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}
        >
            {loading && !balances ? (
                <Skeleton variant="rounded" height={280} />
            ) : (
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={7}>
                        <Box position="relative" display="flex" justifyContent="center">
                            <Chart options={chartOptions} series={series} type="donut" height={220} />
                            <Box position="absolute" top="50%" left="50%" sx={{ transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                                <Typography variant="caption" color="textSecondary">
                                    Total Balance
                                </Typography>
                                <Typography variant="h4">{formatCurrency(balances?.totalBalance ?? 0)}</Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={5}>
                        <Grid container direction="column" spacing={1.5}>
                            {segments.map((s) => (
                                <Grid item key={s.key}>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Box sx={{ width: 6, height: 10, borderRadius: '50%', bgcolor: s.color }} />
                                        <Box>
                                            <Typography variant="body2" color="textSecondary">
                                                {s.label} ({s.percentage}%)
                                            </Typography>
                                            <Typography variant="subtitle1">{formatCurrency(s.value)}</Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                </Grid>
            )}
        </MainCard>
    );
}
