import { useTheme } from '@mui/material/styles';
import { Avatar, Box, Divider, Grid, Skeleton, Typography } from '@mui/material';
import Chart from 'react-apexcharts';
import { IconArrowUp, IconArrowDown, IconArrowUpRight, IconArrowDownRight } from '@tabler/icons-react';
import { PaymentsPeriod, useTopupVsWithdrawals } from 'graphql/queries/payments.queries';
import MainCard from '../cards/MainCard';

const formatCurrency = (value: number) => `Rs. ${value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

export default function TopupWithdrawalCard({ period }: { period: PaymentsPeriod }) {
    const theme = useTheme();
    const { data, loading } = useTopupVsWithdrawals(period);
    const flow = data?.topupVsWithdrawals;

    const trendValues = flow?.netFlowTrend?.map((p) => p.amount) ?? [];
    const sparklineOptions: ApexCharts.ApexOptions = {
        chart: { type: 'line', sparkline: { enabled: true } },
        stroke: { curve: 'smooth', width: 2, colors: [theme.palette.success.dark] },
        tooltip: { enabled: false }
    };

    return (
        <MainCard title="Topup vs Withdrawals">
            {loading && !flow ? (
                <Skeleton variant="rounded" height={280} />
            ) : (
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Box display="flex" alignItems="center" gap={1.5}>
                            <Avatar sx={{ bgcolor: theme.palette.success.light, color: theme.palette.success.dark }}>
                                <IconArrowUp size={20} />
                            </Avatar>
                            <Box flexGrow={1}>
                                <Typography variant="body2" color="textSecondary">
                                    Total Topups
                                </Typography>
                                <Typography variant="h4">{formatCurrency(flow?.totalTopups.value ?? 0)}</Typography>
                            </Box>
                            {flow?.totalTopups.percentChange !== undefined && (
                                <Box display="flex" alignItems="center" gap={0.5}>
                                    <IconArrowUpRight size={14} color={theme.palette.success.dark} />
                                    <Typography variant="caption" sx={{ color: theme.palette.success.dark }}>
                                        {flow.totalTopups.percentChange}%
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Box display="flex" alignItems="center" gap={1.5}>
                            <Avatar sx={{ bgcolor: theme.palette.primary.light, color: theme.palette.primary.dark }}>
                                <IconArrowDown size={20} />
                            </Avatar>
                            <Box flexGrow={1}>
                                <Typography variant="body2" color="textSecondary">
                                    Total Withdrawals
                                </Typography>
                                <Typography variant="h4">{formatCurrency(flow?.totalWithdrawals.value ?? 0)}</Typography>
                            </Box>
                            {flow?.totalWithdrawals.percentChange !== undefined && (
                                <Box display="flex" alignItems="center" gap={0.5}>
                                    <IconArrowUpRight size={14} color={theme.palette.success.dark} />
                                    <Typography variant="caption" sx={{ color: theme.palette.success.dark }}>
                                        {flow.totalWithdrawals.percentChange}%
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Divider />
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container alignItems="center" justifyContent="space-between">
                            <Grid item>
                                <Typography variant="body2" color="textSecondary">
                                    Net Flow
                                </Typography>
                                <Box display="flex" alignItems="center" gap={1}>
                                    <Typography variant="h4">{formatCurrency(flow?.netFlow ?? 0)}</Typography>
                                    {flow?.netFlowPercentChange !== undefined && (
                                        <Box display="flex" alignItems="center">
                                            {flow.netFlowPercentChange >= 0 ? (
                                                <IconArrowUpRight size={14} color={theme.palette.success.dark} />
                                            ) : (
                                                <IconArrowDownRight size={14} color={theme.palette.error.main} />
                                            )}
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    color:
                                                        flow.netFlowPercentChange >= 0
                                                            ? theme.palette.success.dark
                                                            : theme.palette.error.main
                                                }}
                                            >
                                                {Math.abs(flow.netFlowPercentChange)}%
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
                            </Grid>
                            <Grid item xs={5}>
                                {trendValues.length > 0 && (
                                    <Chart options={sparklineOptions} series={[{ data: trendValues }]} type="line" height={50} />
                                )}
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            )}
        </MainCard>
    );
}
