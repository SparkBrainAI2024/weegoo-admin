// components/dashboard/RideStatusDonutChart.tsx
import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';

import Chart from 'react-apexcharts';
import RideStatusDistributionIcon from '../../../assets/images/icons/ride_status_distribution.png';
import { useRideStatusChart } from 'graphql/queries/home-dashboard.queries';
import dayjs from 'dayjs';
import { useUrlParams } from 'hooks/useSearchParams';
import { Icon } from '@mui/material';

// Local to this chart only — intentionally not the shared StatsSection defaults
const LOCAL_DEFAULT_FROM_DATE = dayjs().subtract(6, 'day').format('YYYY-MM-DD');
const LOCAL_DEFAULT_END_DATE = dayjs().format('YYYY-MM-DD');

const RideStatusDonutChart = () => {
    const theme = useTheme();
    const { getParam } = useUrlParams();
    const fromDate = getParam('fromDate', LOCAL_DEFAULT_FROM_DATE);
    const endDate = getParam('endDate', LOCAL_DEFAULT_END_DATE);

    const { data, loading, error } = useRideStatusChart({ fromDate, endDate });

    if (error) {
        return <Alert severity="error">Failed to load ride status chart: {error.message}</Alert>;
    }

    if (loading || !data) {
        return <Skeleton variant="rounded" height={340} />;
    }

    const { completed, cancelled, ongoing } = data.rideStatusChart;
    const series = [completed, cancelled, ongoing];
    const total = completed + cancelled + ongoing;

    const options = {
        chart: { type: 'donut' as const },
        labels: ['Completed', 'Cancelled', 'In Progress'],
        colors: [theme.palette.success.main, theme.palette.error.dark, theme.palette.warning.dark],
        legend: { show: false },
        dataLabels: { enabled: false },
        stroke: { width: 0 },
        plotOptions: {
            pie: {
                donut: {
                    size: '75%',
                    labels: { show: false }
                }
            }
        },
        tooltip: {
            y: {
                formatter: (val: number) => `${val} rides`
            }
        }
    };

    const legendItems = [
        { label: 'Completed', value: completed, color: theme.palette.success.main },
        { label: 'Cancelled', value: cancelled, color: theme.palette.error.dark },
        { label: 'In Progress', value: ongoing, color: theme.palette.warning.dark }
    ];

    return (
        <Card sx={{ height: '100%' }}>
            <CardContent>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                    <Icon>
                        <img src={RideStatusDistributionIcon} alt="Ride Status Distribution" width="26px" />
                    </Icon>{' '}
                    <Typography variant="h5">Ride Status Distribution</Typography>
                </Stack>

                {total === 0 ? (
                    <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
                        No ride data for this period
                    </Typography>
                ) : (
                    <Chart options={options} series={series} type="donut" height={220} />
                )}

                <Stack direction="row" justifyContent="center" spacing={1} flexWrap="wrap" sx={{ mt: 2 }}>
                    {legendItems.map((item) => (
                        <Chip
                            key={item.label}
                            size="small"
                            label={item.label}
                            sx={{
                                bgcolor: 'transparent',
                                '&::before': {
                                    content: '""',
                                    display: 'inline-block',
                                    width: 8,
                                    height: 8,
                                    borderRadius: '50%',
                                    bgcolor: item.color,
                                    mr: 0.75
                                }
                            }}
                        />
                    ))}
                </Stack>
            </CardContent>
        </Card>
    );
};

export default RideStatusDonutChart;
