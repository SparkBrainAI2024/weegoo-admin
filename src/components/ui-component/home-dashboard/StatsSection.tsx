import { ReactNode, useState } from 'react';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import { IconRefresh, IconUser, IconUsers, IconInfoCircle, IconX } from '@tabler/icons-react';

import { StatCard } from './StatCard';
import { useAdminDashboard } from 'graphql/queries/home-dashboard.queries';
import { useUrlParams } from 'hooks/useSearchParams';
import { DEFAULT_END_DATE, DEFAULT_FROM_DATE } from 'utils/dashboard-date-defaults';

interface StatConfig {
    key: string;
    label: string;
    value: number;
    percentageChange: number;
    icon: ReactNode;
    iconBg: string;
}

export function StatsSection() {
    const { getParam } = useUrlParams();
    const fromDate = getParam('fromDate', DEFAULT_FROM_DATE);
    const endDate = getParam('endDate', DEFAULT_END_DATE);

    const [selectedCard, setSelectedCard] = useState<string | null>('rides');

    const { data, loading } = useAdminDashboard({ fromDate, endDate });
    const stats = data?.adminDashboard;

    const cards: StatConfig[] | undefined = stats && [
        {
            key: 'rides',
            label: 'Total Rides (Today)',
            value: stats.totalActiveRides,
            percentageChange: stats.percentageChange.totalActiveRides,
            icon: <IconRefresh size={16} />,
            iconBg: 'success.lighter'
        },
        {
            key: 'drivers',
            label: 'Active Drivers',
            value: stats.activeRider,
            percentageChange: stats.percentageChange.activeRider,
            icon: <IconUser size={16} />,
            iconBg: 'warning.lighter'
        },
        {
            key: 'riders',
            label: 'Active Riders',
            value: stats.activePassenger,
            percentageChange: stats.percentageChange.activePassenger,
            icon: <IconUsers size={16} />,
            iconBg: 'success.lighter'
        },
        {
            key: 'revenue',
            label: 'Total Revenue',
            value: stats.totalRevenue,
            percentageChange: stats.percentageChange.totalRevenue,
            icon: <IconInfoCircle size={16} />,
            iconBg: 'warning.lighter'
        },
        {
            key: 'cancelled',
            label: 'Cancelled Rides',
            value: stats.totalCancelledRides,
            percentageChange: stats.percentageChange.totalCancelledRides,
            icon: <IconX size={16} />,
            iconBg: 'error.lighter'
        }
    ];

    return (
        <Grid container spacing={2}>
            {loading || !cards
                ? Array.from({ length: 5 }).map((_, i) => (
                      <Grid key={i} item xs={12} sm={6} md={2.4}>
                          <Skeleton variant="rounded" height={140} sx={{ borderRadius: 3 }} />
                      </Grid>
                  ))
                : cards.map((c) => (
                      <Grid key={c.key} item xs={12} sm={6} md={2.4}>
                          <StatCard
                              label={c.label}
                              value={c.value.toLocaleString()}
                              percentageChange={c.percentageChange}
                              icon={c.icon}
                              iconBg={c.iconBg}
                              highlighted={selectedCard === c.key}
                              onClick={() => setSelectedCard((current) => (current === c.key ? null : c.key))}
                          />
                      </Grid>
                  ))}
        </Grid>
    );
}
