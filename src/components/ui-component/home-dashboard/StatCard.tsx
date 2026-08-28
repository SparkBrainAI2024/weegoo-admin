// components/ui-component/StatCard.tsx
import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

export interface StatCardProps {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    iconBgColor?: string;
    percentageChange?: number;
    highlight?: boolean; // green left accent, like "Total Rides (Today)" in the screenshot
}

const StatCard = ({ title, value, icon, iconBgColor, percentageChange, highlight }: StatCardProps) => {
    const theme = useTheme();
    const isPositive = (percentageChange ?? 0) >= 0;

    return (
        <Card
            sx={{
                height: '100%',
                borderLeft: highlight ? `3px solid ${theme.palette.success.main}` : 'none',
                boxShadow: theme.shadows[1]
            }}
        >
            <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Typography variant="subtitle2" color="text.secondary">
                        {title}
                    </Typography>
                    <Box
                        sx={{
                            width: 32,
                            height: 32,
                            borderRadius: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: iconBgColor ?? theme.palette.grey[100]
                        }}
                    >
                        {icon}
                    </Box>
                </Stack>

                <Typography variant="h3" sx={{ mt: 1.5, fontWeight: 700 }}>
                    {value}
                </Typography>

                {percentageChange !== undefined && (
                    <Chip
                        size="small"
                        sx={{ mt: 1.5 }}
                        icon={isPositive ? <KeyboardArrowUpIcon fontSize="small" /> : <KeyboardArrowDownIcon fontSize="small" />}
                        label={`${Math.abs(percentageChange).toFixed(1)}%`}
                        color={isPositive ? 'success' : 'error'}
                    />
                )}
            </CardContent>
        </Card>
    );
};

export default StatCard;
