// components/dashboard/DriversPanel.tsx
import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';

import ActiveDriverIcon from '../../../assets/images/icons/active_driver.png';
import { useDriverStatusCounts } from 'graphql/queries/home-dashboard.queries';
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

const DriversPanel = () => {
    const { data, loading, error } = useDriverStatusCounts();

    if (error) {
        return <Alert severity="error">Failed to load driver stats: {error.message}</Alert>;
    }

    if (loading || !data) {
        return <Skeleton variant="rounded" height={280} />;
    }

    const { totalDrivers, onlineDrivers, offlineDrivers } = data.driverStatusCounts;

    return (
        <Card sx={{ height: '100%' }}>
            <CardContent>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                    <Icon>
                        <img src={ActiveDriverIcon} alt="Driver" width="26px" />
                    </Icon>
                    <Typography variant="h5">Drivers</Typography>
                </Stack>

                <Divider />
                <StatRow label="Total Drivers" value={totalDrivers.toLocaleString()} />
                <Divider />
                <StatRow label="Offline" value={offlineDrivers.toLocaleString()} />
                <Divider />
                <StatRow label="Online" value={onlineDrivers.toLocaleString()} />

                {/* TODO: no KYC-pending field in driverStatusCounts yet — screenshot
                    shows a 4th row for this. Needs either a new field on this query
                    or a separate query once the backend exposes it. */}
            </CardContent>
        </Card>
    );
};

export default DriversPanel;
