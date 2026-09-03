import { useTheme } from '@mui/material/styles';
import { Avatar, Box, Divider, Grid, Skeleton, Typography } from '@mui/material';
import { IconArrowUp, IconArrowDown, IconArrowUpRight, IconArrowDownRight } from '@tabler/icons-react';
import { useTopupVsWithdrawals } from 'graphql/queries/payments.queries';
import { useUrlParams } from 'hooks/useSearchParams';
import MainCard from '../cards/MainCard';
import { TimeRangeFilter } from 'types/enum';
import TimeRangeSelect from './TimeRangeSelect';

const formatCurrency = (value: number) => `Rs. ${value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

function ChangeBadge({ percentChange, isIncrease }: { percentChange?: number; isIncrease?: boolean }) {
    const theme = useTheme();
    if (percentChange === undefined || percentChange === null) return null;
    const up = isIncrease ?? percentChange >= 0;
    return (
        <Box display="flex" alignItems="center" gap={0.5}>
            {up ? (
                <IconArrowUpRight size={14} color={theme.palette.success.dark} />
            ) : (
                <IconArrowDownRight size={14} color={theme.palette.error.main} />
            )}
            <Typography variant="caption" sx={{ color: up ? theme.palette.success.dark : theme.palette.error.main }}>
                {Math.abs(percentChange).toFixed(1)}%
            </Typography>
        </Box>
    );
}

export default function TopupWithdrawalCard() {
    const theme = useTheme();
    const { getParam, updateParams } = useUrlParams();
    const filter = getParam('topupFilter', TimeRangeFilter.LAST_7_DAYS) as TimeRangeFilter;

    const { data, loading } = useTopupVsWithdrawals(filter);
    const flow = data?.topupVsWithdrawals;

    return (
        <MainCard
            title="Topup vs Withdrawals"
            secondary={<TimeRangeSelect value={filter} onChange={(val) => updateParams({ topupFilter: val })} />}
            sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}
            contentSX={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}
        >
            {loading && !flow ? (
                <Skeleton variant="rounded" height={220} />
            ) : (
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Box display="flex" alignItems="center" gap={1.5}>
                            <Avatar sx={{ bgcolor: theme.palette.success.light, color: theme.palette.success.dark }}>
                                <IconArrowUp size={20} />
                            </Avatar>
                            <Box flexGrow={1}>
                                <Typography variant="body2" color="textSecondary">
                                    Total Topups
                                </Typography>
                                <Typography variant="h4">{formatCurrency(flow?.totalTopups.value ?? 0)}</Typography>
                            </Box>
                            <ChangeBadge percentChange={flow?.totalTopups.percentChange} isIncrease={flow?.totalTopups.isIncrease} />
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Box display="flex" alignItems="center" gap={1.5}>
                            <Avatar sx={{ bgcolor: theme.palette.primary.light, color: theme.palette.primary.dark }}>
                                <IconArrowDown size={20} />
                            </Avatar>
                            <Box flexGrow={1}>
                                <Typography variant="body2" color="textSecondary">
                                    Total Withdrawals
                                </Typography>
                                <Typography variant="h4">{formatCurrency(flow?.totalWithdrawals.value ?? 0)}</Typography>
                            </Box>
                            <ChangeBadge
                                percentChange={flow?.totalWithdrawals.percentChange}
                                isIncrease={flow?.totalWithdrawals.isIncrease}
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Divider />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body2" color="textSecondary">
                            Net Flow
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1}>
                            <Typography variant="h4">{formatCurrency(flow?.netFlow ?? 0)}</Typography>
                            <ChangeBadge percentChange={flow?.netFlowPercentChange} />
                        </Box>
                    </Grid>
                </Grid>
            )}
        </MainCard>
    );
}
