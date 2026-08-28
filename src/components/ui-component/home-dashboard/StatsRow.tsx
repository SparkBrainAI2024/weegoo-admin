// components/dashboard/StatsRow.tsx
import * as React from 'react';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';

import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CancelIcon from '@mui/icons-material/Cancel';

import StatCard from 'components/ui-component/StatCard';
import { useAdminDashboard } from 'graphql/queries/dashboard.queries';

const StatsRow = () => {
    const { data, loading, error } = useAdminDashboard();

    if (error) {
        return <Alert severity="error">Failed to load dashboard stats: {error.message}</Alert>;
    }

    if (loading || !data) {
        return (
            <Grid container spacing={2.5}>
                {Array.from({ length: 5 }).map((_, i) => (
                    <Grid item xs={12} sm={6} md={4} lg={2.4} key={i}>
                        <Skeleton variant="rounded" height={120} />
                    </Grid>
                ))}
            </Grid>
        );
    }

    const stats = data.adminDashboard;

    const cards = [
        {
            title: 'Total Rides(Today)',
            value: stats.totalActiveRides.toLocaleString(),
            icon: <DirectionsCarIcon fontSize="small" color="success" />,
            percentageChange: stats.percentageChange.totalActiveRides,
            highlight: true
        },
        {
            // TODO: confirmed as an assumption, not a given fact — flip to
            // stats.activeRider if this reads backwards once real data shows up.
            title: 'Active Drivers',
            value: stats.activePassenger.toLocaleString(),
            icon: <PersonIcon fontSize="small" sx={{ color: 'warning.main' }} />,
            percentageChange: stats.percentageChange.activePassenger
        },
        {
            title: 'Active Riders',
            value: stats.activeRider.toLocaleString(),
            icon: <GroupIcon fontSize="small" color="success" />,
            percentageChange: stats.percentageChange.activeRider
        },
        {
            title: 'Total Revenue',
            value: `Rs. ${stats.totalRevenue.toLocaleString()}`,
            icon: <AttachMoneyIcon fontSize="small" sx={{ color: 'warning.main' }} />,
            percentageChange: stats.percentageChange.totalRevenue
        },
        {
            title: 'Cancelled Rides',
            value: stats.totalCancelledRides.toLocaleString(),
            icon: <CancelIcon fontSize="small" color="error" />,
            percentageChange: stats.percentageChange.totalCancelledRides
        }
    ];

    return (
        <Grid container spacing={2.5}>
            {cards.map((card) => (
                <Grid item xs={12} sm={6} md={4} lg={2.4} key={card.title}>
                    <StatCard {...card} />
                </Grid>
            ))}
        </Grid>
    );
};

export default StatsRow;
