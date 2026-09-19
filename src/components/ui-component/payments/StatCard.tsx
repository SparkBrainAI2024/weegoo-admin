import { useTheme } from '@mui/material/styles';
import { Avatar, Box, Grid, Stack, Typography } from '@mui/material';
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
    return (
        <MainCard contentSX={{ p: 2.25 }} sx={{ height: '10%' }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Box>
                    <Stack spacing={1}>
                        <Typography variant="subtitle2" color="textSecondary">
                            {title}
                        </Typography>{' '}
                        <Typography variant="h3">{value}</Typography>
                        {caption && (
                            <Typography variant="caption" color="textSecondary">
                                {caption}
                            </Typography>
                        )}
                    </Stack>
                </Box>
                <Avatar sx={{ bgcolor: iconBgColor, color: '#22C55E', width: 54, height: 54 }}>{icon}</Avatar>
            </Stack>
        </MainCard>
    );
}
