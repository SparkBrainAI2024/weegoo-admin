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
            color: '#8B5CF6'
        },
        {
            key: 'customer',
            label: balances?.customerWallet.label ?? 'Customer Wallet Balance',
            value: balances?.customerWallet.value ?? 0,
            percentage: balances?.customerWallet.percentage ?? 0,
            color: '#3B82F6'
        },
        {
            key: 'commission',
            label: balances?.commission.label ?? 'Commission',
            value: balances?.commission.value ?? 0,
            percentage: balances?.commission.percentage ?? 0,
            color: '#42C018'
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
            sx={{
                width: '100%',
                display: 'flex',
                height: '100%',
                flexDirection: 'column',
                fontSize: '13px',
                '& .MuiCardHeader-root': { py: 0.2, px: 0.2 },
                '& .MuiCardContent-root': { pt: 0.2, px: 0.2 }
            }}
            contentSX={{ flexGrow: 1, display: 'flex', flexDirection: 'column', padding: 0 }}
        >
            {loading && !balances ? (
                <Skeleton variant="rounded" />
            ) : (
                <Grid container spacing={0} alignItems="stretch" height="100%">
                    <Grid item xs={12} sm={7} sx={{ display: 'flex' }}>
                        <Box
                            position="relative"
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            flexGrow={1}
                            sx={{ border: '1px solid red' }}
                        >
                            <Chart options={chartOptions} series={series} type="donut" />
                            <Box position="absolute" top="50%" left="50%" sx={{ transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                                <Typography variant="caption" color="textSecondary" sx={{ fontSize: '9.5px' }}>
                                    Total Balance
                                </Typography>
                                <Typography variant="h4" sx={{ fontSize: '13.5px' }}>
                                    {formatCurrency(balances?.totalBalance ?? 0)}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={5}>
                        <Grid container direction="column" spacing={0.8}>
                            {segments.map((s) => (
                                <Grid item key={s.key}>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Box sx={{ borderRadius: '50%', bgcolor: s.color }} />
                                        <Box>
                                            <Typography variant="body2" sx={{ fontSize: '11px' }} color="textSecondary">
                                                {s.label} ({s.percentage}%)
                                            </Typography>
                                            <Typography variant="subtitle1" sx={{ fontSize: '13px' }}>
                                                {formatCurrency(s.value)}
                                            </Typography>
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
