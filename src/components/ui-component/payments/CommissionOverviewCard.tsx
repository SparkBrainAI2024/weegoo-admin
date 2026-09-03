import { Box, Skeleton, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Chart from 'react-apexcharts';

import { useCommissionOverview } from 'graphql/queries/payments.queries';
import { useUrlParams } from 'hooks/useSearchParams';
import { TimeRangeFilter } from 'types/enum';

import MainCard from '../cards/MainCard';
import TimeRangeSelect from './TimeRangeSelect';

const formatCurrency = (value: number) =>
    `Rs. ${value.toLocaleString('en-IN', {
        minimumFractionDigits: 2
    })}`;

export default function CommissionOverviewCard() {
    const theme = useTheme();
    const { getParam, updateParams } = useUrlParams();

    const filter = getParam('commissionFilter', TimeRangeFilter.LAST_7_DAYS) as TimeRangeFilter;

    const { data, loading } = useCommissionOverview({ filter });

    console.log(data, 'data');

    const overview = data?.commissionOverview;

    const categories = overview?.dataPoints.map((p) => p.date) ?? [];

    const values = overview?.dataPoints.map((p) => p.amount) ?? [];

    const percentChange = overview?.percentChange ?? 0;

    const isUp = percentChange >= 0;

    const hasData = (overview?.dataPoints?.length ?? 0) > 0;

    const chartOptions: ApexCharts.ApexOptions = {
        chart: { type: 'area', toolbar: { show: false }, sparkline: { enabled: false } },
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth', width: 2, colors: [theme.palette.success.dark] },
        fill: {
            type: 'gradient',
            gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05, stops: [0, 90, 100] }
        },
        colors: [theme.palette.success.dark],
        xaxis: {
            categories,
            tickAmount: filter === TimeRangeFilter.LAST_MONTH ? 6 : undefined,
            labels: {
                style: { colors: theme.palette.text.secondary },
                rotate: filter === TimeRangeFilter.LAST_MONTH ? -45 : 0
            },
            axisBorder: { show: false },
            axisTicks: { show: false }
        }, // ← replaced block ends here
        yaxis: { labels: { style: { colors: theme.palette.text.secondary } } },
        grid: { borderColor: theme.palette.divider },
        tooltip: { y: { formatter: (val: number) => formatCurrency(val) } }
    };

    const series = [
        {
            name: 'Commission',
            data: values
        }
    ];

    return (
        <MainCard
            title="Commission Overview"
            secondary={
                <TimeRangeSelect
                    value={filter}
                    onChange={(val) =>
                        updateParams({
                            commissionFilter: val
                        })
                    }
                />
            }
            sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                '& .MuiCardHeader-root': { py: 1.5, px: 2 },
                '& .MuiCardContent-root': { pt: 1.5, px: 2, pb: 1.5 }
            }}
            contentSX={{ display: 'flex', flexDirection: 'column' }}
        >
            {loading && !overview ? (
                <Skeleton variant="rounded" height={280} />
            ) : !hasData ? (
                <Typography variant="body2" color="textSecondary">
                    No data for this period
                </Typography>
            ) : (
                <>
                    <Box>
                        <Typography variant="caption" color="textSecondary">
                            Total Commission
                        </Typography>

                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Typography variant="h3">{formatCurrency(overview?.totalCommission ?? 0)}</Typography>

                            {overview?.percentChange !== undefined && (
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: isUp ? theme.palette.success.main : theme.palette.error.main
                                    }}
                                >
                                    {isUp ? '▲' : '▼'} {Math.abs(percentChange).toFixed(1)}%
                                </Typography>
                            )}
                        </Stack>
                    </Box>

                    <Chart key={filter} options={chartOptions} series={series} type="area" width="100%" height={280} />
                </>
            )}
        </MainCard>
    );
}
