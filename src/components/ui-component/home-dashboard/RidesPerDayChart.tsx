// components/dashboard/RidesPerDayChart.tsx
import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';

import Chart from 'react-apexcharts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useCompletedRideChart } from 'graphql/queries/home-dashboard.queries';
import dayjs from 'dayjs';
import { useUrlParams } from 'hooks/useSearchParams';

// Local to this chart only — intentionally not the shared StatsSection defaults
const LOCAL_DEFAULT_FROM_DATE = dayjs().subtract(6, 'day').format('YYYY-MM-DD');
const LOCAL_DEFAULT_END_DATE = dayjs().format('YYYY-MM-DD');

const RidesPerDayChart = () => {
    const theme = useTheme();
    const { getParam } = useUrlParams();
    const fromDate = getParam('fromDate', LOCAL_DEFAULT_FROM_DATE);
    const endDate = getParam('endDate', LOCAL_DEFAULT_END_DATE);

    const { data, loading, error } = useCompletedRideChart({ fromDate, endDate });

    if (error) {
        return <Alert severity="error">Failed to load rides-per-day chart: {error.message}</Alert>;
    }

    if (loading || !data) {
        return <Skeleton variant="rounded" height={340} />;
    }

    const { data: points, groupBy } = data.getCompletedRideDashboardChart;
    const categories = points.map((p) => p.label);
    const series = [{ name: 'Completed Rides', data: points.map((p) => p.value) }];

    const options = {
        chart: {
            type: 'area' as const,
            toolbar: { show: false },
            zoom: { enabled: false }
        },
        colors: [theme.palette.success.main],
        stroke: { curve: 'smooth' as const, width: 3 },
        markers: { size: 4, colors: [theme.palette.success.main] },
        fill: {
            type: 'gradient',
            gradient: { shadeIntensity: 1, opacityFrom: 0.35, opacityTo: 0.05 }
        },
        dataLabels: { enabled: false },
        grid: { borderColor: theme.palette.divider },
        xaxis: {
            categories,
            axisBorder: { show: false },
            axisTicks: { show: false }
        },
        yaxis: {
            labels: { formatter: (val: number) => val.toLocaleString() }
        },
        tooltip: {
            y: { formatter: (val: number) => `${val} rides` }
        }
    };

    return (
        <Card sx={{ height: '100%' }}>
            <CardContent>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                    <TrendingUpIcon fontSize="small" color="action" />
                    <Typography variant="h5">Rides per Day {groupBy ? `(${groupBy})` : ''}</Typography>
                </Stack>

                {points.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" sx={{ py: 6, textAlign: 'center' }}>
                        No ride data for this period
                    </Typography>
                ) : (
                    <Chart options={options} series={series} type="area" height={280} />
                )}
            </CardContent>
        </Card>
    );
};

export default RidesPerDayChart;
