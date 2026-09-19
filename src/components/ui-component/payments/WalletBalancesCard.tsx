import { Box, Grid, Skeleton, Stack, Typography } from '@mui/material';
import Chart from 'react-apexcharts';

import { useWalletBalances } from 'graphql/queries/payments.queries';

import PaymentChartLevelCard from '../PaymentChartLevelCard';

const formatCurrency = (value: number) => `Rs. ${value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

export default function WalletBalancesCard() {
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
        plotOptions: { pie: { customScale: 1, donut: { size: '75%', labels: { show: false } } } },
        stroke: { width: 0 }
    };

    const series = segments.map((s) => s.value);

    return (
        <PaymentChartLevelCard title="Wallet Balances">
            {loading && !balances ? (
                <Skeleton variant="rounded" height="100%" />
            ) : (
                <Grid container sx={{ height: '100%' }}>
                    {/* Donut chart */}
                    <Grid item xs={12} sm={7} sx={{ display: 'flex' }}>
                        <Box
                            sx={{
                                position: 'relative',
                                flex: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <Chart options={chartOptions} series={series} type="donut" />

                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    textAlign: 'center'
                                }}
                            >
                                <Typography variant="caption" color="textSecondary" sx={{ fontSize: '9.5px' }}>
                                    Total Balance
                                </Typography>
                                <Typography variant="h4" sx={{ fontSize: '13.5px' }}>
                                    {formatCurrency(balances?.totalBalance ?? 0)}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>

                    {/* Legend */}
                    <Grid item xs={12} sm={5} sx={{ display: 'flex' }}>
                        <Stack spacing={0.8} sx={{ flex: 1, justifyContent: 'center' }}>
                            {segments.map((s) => (
                                <Box key={s.key} display="flex" alignItems="center" gap={1}>
                                    <Box
                                        sx={{
                                            width: 8,
                                            height: 8,
                                            borderRadius: '50%',
                                            bgcolor: s.color,
                                            flexShrink: 0
                                        }}
                                    />

                                    <Box>
                                        <Typography variant="body2" color="textSecondary" sx={{ fontSize: '11px' }}>
                                            {s.label} ({s.percentage}%)
                                        </Typography>
                                        <Typography variant="subtitle1" sx={{ fontSize: '13px' }}>
                                            {formatCurrency(s.value)}
                                        </Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Stack>
                    </Grid>
                </Grid>
            )}
        </PaymentChartLevelCard>
    );
}
