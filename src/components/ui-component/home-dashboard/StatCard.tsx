import { ReactNode } from 'react';
import { Card, CardContent, Stack, Box, Typography, Chip } from '@mui/material';
import { IconArrowUpRight, IconArrowDownRight } from '@tabler/icons-react';

export interface StatCardProps {
    label: string;
    value: number | string;
    percentageChange: number; // e.g. 10.2 or -16.2
    icon: ReactNode;
    iconBg?: string;
    highlighted?: boolean; // green top-edge cap, e.g. selected card
    onClick?: () => void;
}

export function StatCard({ label, value, percentageChange, icon, iconBg = 'grey.100', highlighted, onClick }: StatCardProps) {
    const isPositive = percentageChange >= 0;

    return (
        <Card
            variant="outlined"
            onClick={onClick}
            sx={{
                borderRadius: 6,
                cursor: onClick ? 'pointer' : 'default',
                borderColor: 'divider',
                borderTopWidth: 8,
                borderTopColor: highlighted ? 'success.main' : 'divider',
                transition: 'border-top-color 0.15s ease',
                boxShadow: '0 1px 2px rgba(16,24,40,0.05)',
                '&:hover': {
                    borderTopColor: 'success.main'
                }
            }}
        >
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1.5}>
                    <Typography variant="body2" color="text.secondary" fontWeight={500}>
                        {label}
                    </Typography>
                    <Box
                        sx={{
                            width: 28,
                            height: 28,
                            borderRadius: 1.5,
                            bgcolor: iconBg,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        {icon}
                    </Box>
                </Stack>

                <Typography variant="h3" fontWeight={700} mb={1}>
                    {value}
                </Typography>

                <Chip
                    size="small"
                    icon={isPositive ? <IconArrowUpRight size={14} stroke={2} /> : <IconArrowDownRight size={14} stroke={2} />}
                    label={`${Math.abs(percentageChange)}%`}
                    sx={{
                        bgcolor: isPositive ? 'success.lighter' : 'error.lighter',
                        color: isPositive ? 'success.dark' : 'error.dark',
                        fontWeight: 600,
                        '& .MuiChip-icon': { color: 'inherit' }
                    }}
                />
            </CardContent>
        </Card>
    );
}
