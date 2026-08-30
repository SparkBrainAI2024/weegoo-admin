import { Box, Card, CardContent, Grid, Icon, Stack, Typography } from '@mui/material';
import DriversPanel from 'components/ui-component/home-dashboard/DriversPanel';
import ReportsPanel from 'components/ui-component/home-dashboard/ReportsPanel';
import RidersPanel from 'components/ui-component/home-dashboard/RidersPanel';
import RidersRegistrationChart from 'components/ui-component/home-dashboard/RidersRegistrationChart';
import RidesPerDayChart from 'components/ui-component/home-dashboard/RidesPerDayChart';
import RideStatusDonutChart from 'components/ui-component/home-dashboard/RideStatusDonutChart';
import { StatsSection } from 'components/ui-component/home-dashboard/StatsSection';

import OnlineIcon from '../../assets/images/icons/online.png';

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
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                                <Stack direction="row" spacing={1}>
                                    <Icon>
                                        <img src={OnlineIcon} alt="Driver" width="26px" />
                                    </Icon>
                                    <Typography variant="h5">API Status:Online</Typography>
                                </Stack>
                                <Typography variant="h5">Android App: V1.0.4</Typography>
                                <Typography variant="h5">iOS App: V1.0.4</Typography>
                                <Typography variant="h5">Last Updated: 2 minutes ago</Typography>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Stack>
    );
};
export default Dashboard;
