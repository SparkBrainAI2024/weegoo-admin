// components/dashboard/RidersPanel.tsx
import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';
import MuiLink from '@mui/material/Link';
import { Link as RouterLink } from 'react-router-dom';

import ActiveRidersIcon from '../../../assets/images/icons/active_riders.png';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useTotalRidersChart } from 'graphql/queries/home-dashboard.queries';
import { Link } from 'react-router-dom';
import { Icon } from '@mui/material';

const StatRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ py: 1.25 }}>
        <Typography variant="body2" color="text.secondary">
            {label}
        </Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {value}
        </Typography>
    </Stack>
);

const RidersPanel = () => {
    const { data, loading, error } = useTotalRidersChart();

    if (error) {
        return <Alert severity="error">Failed to load rider stats: {error.message}</Alert>;
    }

    if (loading || !data) {
        return <Skeleton variant="rounded" height={280} />;
    }

    const { totalNoOfUsers, usersJoinedToday, blockedUsers } = data.getTotalRidersChart;

    return (
        <Card sx={{ height: '100%' }}>
            <CardContent>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                    <Icon>
                        <img src={ActiveRidersIcon} alt="Riders" width="26px" />
                    </Icon>{' '}
                    <Typography variant="h5">Riders</Typography>
                </Stack>

                <Divider />
                <StatRow label="Total Riders" value={totalNoOfUsers.toLocaleString()} />
                <Divider />
                <StatRow label="New Riders Today" value={usersJoinedToday.toLocaleString()} />
                <Divider />
                <StatRow label="Blocked Users" value={blockedUsers.toLocaleString()} />

                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={0.5}
                    component={Link}
                    to="/reports/financial"
                    sx={{ mt: 1.5, color: 'warning.dark', textDecoration: 'none', fontWeight: 600, fontSize: '0.8125rem' }}
                >
                    <MuiLink
                        component={RouterLink}
                        to="/payments"
                        sx={{
                            textDecoration: 'none',
                            color: 'inherit'
                        }}
                    >
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'inherit' }}>
                            View detail financial reports
                        </Typography>
                    </MuiLink>
                    <ArrowForwardIcon sx={{ fontSize: 14 }} />
                </Stack>
            </CardContent>
        </Card>
    );
};

export default RidersPanel;
