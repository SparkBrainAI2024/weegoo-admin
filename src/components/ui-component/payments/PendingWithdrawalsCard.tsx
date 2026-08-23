import { useTheme } from '@mui/material/styles';
import { Avatar, Box, Divider, Grid, Skeleton, Typography } from '@mui/material';
import { usePendingWithdrawals } from 'graphql/queries/payments.queries';
import MainCard from '../cards/MainCard';

const formatCurrency = (value: number) => `-Rs. ${value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `Requested on ${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} ${d.toLocaleTimeString(
        'en-US',
        {
            hour: '2-digit',
            minute: '2-digit'
        }
    )}`;
};

export default function PendingWithdrawalsCard() {
    const theme = useTheme();
    const { data, loading } = usePendingWithdrawals();
    const result = data?.pendingWithdrawals;

    return (
        <MainCard title="Pending Withdrawals">
            {loading && !result ? (
                <Skeleton variant="rounded" height={280} />
            ) : (
                <Grid container spacing={2}>
                    {result?.data.map((w) => (
                        <Grid item xs={12} key={w.id}>
                            <Box display="flex" alignItems="center" gap={1.5}>
                                <Avatar sx={{ bgcolor: theme.palette.grey[200], color: theme.palette.text.primary }}>
                                    {(w.fullName ?? '?')
                                        .split(' ')
                                        .map((n) => n[0])
                                        .slice(0, 2)
                                        .join('')
                                        .toUpperCase()}
                                </Avatar>
                                <Box flexGrow={1}>
                                    <Typography variant="subtitle2">{w.fullName ?? '—'}</Typography>
                                    <Typography variant="caption" color="textSecondary">
                                        ID: {w.displayId ?? '—'}
                                    </Typography>
                                    <Typography variant="caption" color="textSecondary" display="block">
                                        {formatDate(w.requestedAt)}
                                    </Typography>
                                </Box>
                                <Box textAlign="right">
                                    <Typography variant="subtitle2" color="error">
                                        {formatCurrency(w.amount)}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: theme.palette.warning.dark }}>
                                        Pending
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                    ))}
                    <Grid item xs={12}>
                        <Divider sx={{ my: 1 }} />
                        <Box display="flex" justifyContent="space-between">
                            <Typography variant="subtitle1">Total Pending</Typography>
                            <Typography variant="subtitle1" color="error">
                                Rs. {(result?.totalPending ?? 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            )}
        </MainCard>
    );
}
