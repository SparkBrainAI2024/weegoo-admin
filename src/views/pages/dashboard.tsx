import { Grid, Stack } from '@mui/material';

const Dashboard = () => {
    return (
        <>
            <Stack spacing={3}>
                {/* Row 1 — Stats: 5 equal-ish cards */}
                <Grid container spacing={2}>
                    {stats.map((s) => (
                        <Grid key={s.key} item xs={12} sm={6} md={2.4}>
                            <StatCard {...s} />
                        </Grid>
                    ))}
                </Grid>

                {/* Row 2 — Charts={ li}e + bar bigger, donut smaller */}
                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                        <RidesPerDayChart />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <RidersChart />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <RideStatusDonut />
                    </Grid>
                </Grid>

                {/* Row 3 — Overview panels: Drivers / Riders / Reports */}
                <Grid container spacing={2}>
                    <Grid xs={12} md={4}>
                        <DriversPanel />
                    </Grid>
                    <Grid xs={12} md={4}>
                        <RidersPanel />
                    </Grid>
                    <Grid xs={12} md={4}>
                        <ReportsPanel />
                    </Grid>
                </Grid>
            </Stack>
        </>
    );
};
export default Dashboard;
