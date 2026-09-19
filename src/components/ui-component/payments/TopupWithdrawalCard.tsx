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
            <Typography variant="caption" sx={{ color: up ? theme.palette.success.dark : theme.palette.error.main, fontSize: '11px' }}>
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
            sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                fontSize: '13px',
                paddingX: '8px',

                '& .MuiCardHeader-root': {
                    px: 0.2,
                    py: 0,
                    alignItems: 'center'
                },

                '& .MuiCardHeader-action': {
                    margin: 0,
                    alignSelf: 'center'
                },

                '& .MuiCardContent-root': {
                    px: 0.2,
                    pb: 0.2
                }
            }}
            contentSX={{ flexGrow: 1, display: 'flex', flexDirection: 'column', padding: 0 }}
        >
            {loading && !flow ? (
                <Skeleton variant="rounded" />
            ) : (
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Box display="flex" alignItems="center" gap={1.5}>
                            <Avatar sx={{ bgcolor: '#F0FDF4', color: '#22C55E' }}>
                                <IconArrowUp size={20} />
                            </Avatar>
                            <Box flexGrow={1}>
                                <Typography sx={{ fontSize: '11px' }} color="textSecondary">
                                    Total Topups
                                </Typography>
                                <Typography variant="h4" sx={{ fontSize: '16px' }}>
                                    {formatCurrency(flow?.totalTopups.value ?? 0)}
                                </Typography>
                            </Box>
                            <ChangeBadge percentChange={flow?.totalTopups.percentChange} isIncrease={flow?.totalTopups.isIncrease} />
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Box display="flex" alignItems="center" gap={1.5}>
                            <Avatar sx={{ bgcolor: '#EFF6FF', color: '#3B82F6' }}>
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
