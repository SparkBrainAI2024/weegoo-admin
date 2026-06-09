import { memo } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

import { linearProgressClasses } from '@mui/material/LinearProgress';

// assets
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';

// types
import { ThemeMode } from 'types/config';

interface LinearProgressWithLabelProps {
    value: number;
}

// ==============================|| PROGRESS BAR WITH LABEL ||============================== //

function LinearProgressWithLabel({ value, ...others }: LinearProgressWithLabelProps) {
    const theme = useTheme();

    return (
        <Grid container direction="column" spacing={1} sx={{ mt: 1.5 }}>
            <Grid item>
                <Grid container justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h6" sx={{ color: theme.palette.mode === ThemeMode.DARK ? 'dark.light' : 'primary.800' }}>
                            Progress
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="h6" color="inherit">{`${Math.round(value)}%`}</Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item>
                <LinearProgress
                    aria-label="progress of theme"
                    variant="determinate"
                    value={value}
                    {...others}
                    sx={{
                        height: 10,
                        borderRadius: 30,
                        [`&.${linearProgressClasses.colorPrimary}`]: {
                            bgcolor: 'background.paper'
                        },
                        [`& .${linearProgressClasses.bar}`]: {
                            borderRadius: 5,
                            bgcolor: 'primary.dark'
                        }
                    }}
                />
            </Grid>
        </Grid>
    );
}

// ==============================|| SIDEBAR - MENU CARD ||============================== //

const MenuCard = () => {
    const theme = useTheme();

    return (
        <Card
            sx={{
                bgcolor: theme.palette.mode === ThemeMode.DARK ? 'dark.main' : 'primary.light',
                mb: 2.75,
                overflow: 'hidden',
                position: 'relative',
                '&:after': {
                    content: '""',
                    position: 'absolute',
                    width: 157,
                    height: 157,
                    bgcolor: theme.palette.mode === ThemeMode.DARK ? 'dark.dark' : 'primary.200',
                    borderRadius: '50%',
                    top: -105,
                    right: -96
                }
            }}
        >
        </Card>
    );
};

export default memo(MenuCard);
