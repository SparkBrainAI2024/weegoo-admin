// components/dashboard/RidersRegistrationChart.tsx
import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';

import Chart from 'react-apexcharts';
import { usePassengerRegistrationChart } from 'graphql/queries/home-dashboard.queries';
import dayjs from 'dayjs';
import { useUrlParams } from 'hooks/useSearchParams';
import { Icon } from '@mui/material';
import RidersIcon from '../../../assets/images/icons/riders.png';

// Local to this chart only — intentionally not the shared StatsSection defaults
const LOCAL_DEFAULT_FROM_DATE = dayjs().subtract(6, 'day').format('YYYY-MM-DD');
const LOCAL_DEFAULT_END_DATE = dayjs().format('YYYY-MM-DD');

const RidersRegistrationChart = () => {
    const theme = useTheme();
    const { getParam } = useUrlParams();
    const fromDate = getParam('fromDate', LOCAL_DEFAULT_FROM_DATE);
    const endDate = getParam('endDate', LOCAL_DEFAULT_END_DATE);

    const { data, loading, error } = usePassengerRegistrationChart({ fromDate, endDate });

    if (error) {
        return <Alert severity="error">Failed to load riders chart: {error.message}</Alert>;
    }

    if (loading || !data) {
        return <Skeleton variant="rounded" height={340} />;
    }

    const { data: points } = data.passengerRegistrationChart;
    const categories = points.map((p) => p.label);
    const series = [{ name: 'New Riders', data: points.map((p) => p.value) }];

    const options = {
        chart: {
            type: 'bar' as const,
            toolbar: { show: false }
        },
        colors: [theme.palette.warning.dark],
        plotOptions: {
            bar: { borderRadius: 4, columnWidth: '45%' }
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
            y: { formatter: (val: number) => `${val.toLocaleString()} riders` }
        }
    };

    return (
        <Card sx={{ height: '100%' }}>
            <CardContent>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                    <Icon>
                        <img src={RidersIcon} alt="Riders Registration Chart" width="26px" />
                    </Icon>
                    <Typography variant="h5">Riders</Typography>
                </Stack>

                {points.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" sx={{ py: 6, textAlign: 'center' }}>
                        No registration data for this period
                    </Typography>
                ) : (
                    <Chart options={options} series={series} type="bar" height={280} />
                )}
            </CardContent>
        </Card>
    );
};

export default RidersRegistrationChart;
