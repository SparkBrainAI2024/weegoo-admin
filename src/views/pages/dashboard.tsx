import { Grid, Stack } from '@mui/material';
import DriversPanel from 'components/ui-component/home-dashboard/DriversPanel';
import ReportsPanel from 'components/ui-component/home-dashboard/ReportsPanel';
import RidersPanel from 'components/ui-component/home-dashboard/RidersPanel';
import RidersRegistrationChart from 'components/ui-component/home-dashboard/RidersRegistrationChart';
import RidesPerDayChart from 'components/ui-component/home-dashboard/RidesPerDayChart';
import RideStatusDonutChart from 'components/ui-component/home-dashboard/RideStatusDonutChart';
import { StatsSection } from 'components/ui-component/home-dashboard/StatsRow';

const Dashboard = () => {
    return (
        <Stack spacing={3}>
            {/* Row 1 — Stats */}
            <StatsSection />

            {/* Row 2 — Charts */}
            <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                    <RidesPerDayChart />
                </Grid>
                <Grid item xs={12} md={4}>
                    <RidersRegistrationChart />
                </Grid>
                <Grid item xs={12} md={4}>
                    <RideStatusDonutChart />
                </Grid>
            </Grid>

            {/* Row 3 — Overview panels */}
            <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                    <DriversPanel />
                </Grid>
                <Grid item xs={12} md={4}>
                    <RidersPanel />
                </Grid>
                <Grid item xs={12} md={4}>
                    <ReportsPanel />
                </Grid>
            </Grid>
        </Stack>
    );
};
export default Dashboard;
