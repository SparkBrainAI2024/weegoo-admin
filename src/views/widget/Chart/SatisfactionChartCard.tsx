// material-ui
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// third-party
import Chart, { Props as ChartProps } from 'react-apexcharts';

// project imports
import MainCard from 'ui-component/cards/MainCard';

// =========================|| SATISFACTION CHART CARD ||========================= //

const SatisfactionChartCard = ({ chartData }: { chartData: ChartProps }) => {
    return (
        <MainCard>
            <Grid container direction="column" spacing={1}>
                <Grid item>
                    <Typography variant="subtitle1">Customer Satisfaction</Typography>
                </Grid>
                <Grid item>
                    <Chart {...chartData} />
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default SatisfactionChartCard;
