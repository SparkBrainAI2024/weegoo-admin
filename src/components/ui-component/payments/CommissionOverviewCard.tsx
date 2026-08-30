import { useTheme } from '@mui/material/styles';
import { Box, Skeleton, Typography } from '@mui/material';
import Chart from 'react-apexcharts';
import { useCommissionOverview } from 'graphql/queries/payments.queries';
import { useUrlParams } from 'hooks/useSearchParams';
import MainCard from '../cards/MainCard';

const formatCurrency = (value: number) => `Rs. ${value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

export default function CommissionOverviewCard() {
    const theme = useTheme();
    const { getParam } = useUrlParams();
    const fromDate = getParam('fromDate', '');
    const endDate = getParam('endDate', '');
    const { data, loading } = useCommissionOverview(fromDate, endDate);
    const overview = data?.commissionOverview;

    const categories = overview?.series.map((p) => p.date) ?? [];
    const values = overview?.series.map((p) => p.amount) ?? [];

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
            labels: { style: { colors: theme.palette.text.secondary } },
            axisBorder: { show: false },
            axisTicks: { show: false }
        },
        yaxis: { labels: { style: { colors: theme.palette.text.secondary } } },
        grid: { borderColor: theme.palette.divider },
        tooltip: { y: { formatter: (val: number) => formatCurrency(val) } }
    };

    const series = [{ name: 'Commission', data: values }];

    return (
        <MainCard title="Commission Overview">
            {loading && !overview ? (
                <Skeleton variant="rounded" height={280} />
            ) : (
                <>
                    <Box mb={1}>
                        <Typography variant="caption" color="textSecondary">
                            Total Commission
                        </Typography>
                        <Typography variant="h3">{formatCurrency(overview?.totalCommission ?? 0)}</Typography>
                    </Box>
                    <Chart options={chartOptions} series={series} type="area" height={280} />
                </>
            )}
        </MainCard>
    );
}
