import { useTheme } from '@mui/material/styles';
import { Avatar, Box, Grid, Typography } from '@mui/material';
import { IconArrowUpRight, IconArrowDownRight } from '@tabler/icons-react';
import MainCard from '../cards/MainCard';

interface StatCardProps {
    title: string;
    value: string;
    percentChange?: number;
    isIncrease?: boolean;
    caption?: string;
    icon: React.ReactNode;
    iconBgColor?: string;
    iconColor?: string;
}

export default function StatCard({ title, value, percentChange, isIncrease, caption, icon, iconBgColor, iconColor }: StatCardProps) {
    const theme = useTheme();

    return (
        <MainCard contentSX={{ p: 2.25 }}>
            <Grid container direction="column" spacing={1}>
                <Grid container justifyContent="space-between" alignItems="flex-start">
                    <Grid item>
                        <Typography variant="subtitle2" color="textSecondary">
                            {title}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Avatar
                            variant="rounded"
                            sx={{
                                width: 40,
                                height: 40,
                                bgcolor: iconBgColor ?? theme.palette.secondary.light,
                                color: iconColor ?? theme.palette.secondary.dark
                            }}
                        >
                            {icon}
                        </Avatar>
                    </Grid>
                </Grid>
                <Grid item>
                    <Typography variant="h4">{value}</Typography>
                </Grid>
                {percentChange !== undefined && (
                    <Grid item>
                        <Box display="flex" alignItems="center" gap={0.5}>
                            {isIncrease ? (
                                <IconArrowUpRight size={16} color={theme.palette.success.dark} />
                            ) : (
                                <IconArrowDownRight size={16} color={theme.palette.error.main} />
                            )}
                            <Typography
                                variant="caption"
                                sx={{ color: isIncrease ? theme.palette.success.dark : theme.palette.error.main, fontWeight: 500 }}
                            >
                                {Math.abs(percentChange)}%
                            </Typography>
                            {caption && (
                                <Typography variant="caption" color="textSecondary">
                                    {caption}
                                </Typography>
                            )}
                        </Box>
                    </Grid>
                )}
            </Grid>
        </MainCard>
    );
}
