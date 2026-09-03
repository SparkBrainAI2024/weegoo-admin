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
    const theme = useTheme();

    return (
        <MainCard contentSX={{ p: 2.25 }}>
            <Stack direction="row" alignItems="center">
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
                        {/* {percentChange !== undefined && (
                            <Stack justifyContent="left" gap={0.5}>
                                {isIncrease ? (
                                    <IconArrowUpRight size={16} color={theme.palette.success.dark} />
                                ) : (
                                    <IconArrowDownRight size={16} color={theme.palette.error.main} />
                                )}

                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: isIncrease ? theme.palette.success.dark : theme.palette.error.main,
                                        fontWeight: 500
                                    }}
                                >
                                    {Math.abs(percentChange)}%
                                </Typography>

                                {caption && (
                                    <Typography variant="caption" color="textSecondary">
                                        {caption}
                                    </Typography>
                                )}
                            </Stack>
                        )} */}
                    </Stack>
                </Box>
            </Stack>
        </MainCard>
    );
}
