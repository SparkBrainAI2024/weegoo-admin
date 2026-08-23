import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import {
    Avatar,
    Box,
    Chip,
    Pagination,
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';
import { TransactionStatus, TransactionType, useRecentTransactions } from 'graphql/queries/payments.queries';
import MainCard from '../cards/MainCard';

const formatCurrency = (value: number, direction: 'DEBIT' | 'CREDIT') =>
    `${direction === 'DEBIT' ? '-' : '+'}Rs. ${Math.abs(value).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

const typeChipColor: Record<TransactionType, 'success' | 'primary' | 'secondary' | 'warning'> = {
    [TransactionType.COMMISSION]: 'success',
    [TransactionType.TOPUP]: 'primary',
    [TransactionType.RIDE_PAYMENT]: 'secondary',
    [TransactionType.WITHDRAWAL]: 'warning'
};

const statusChipColor: Record<TransactionStatus, 'success' | 'warning' | 'error'> = {
    [TransactionStatus.COMPLETED]: 'success',
    [TransactionStatus.PENDING]: 'warning',
    [TransactionStatus.FAILED]: 'error'
};

const formatDateTime = (iso: string) => {
    const d = new Date(iso);
    return {
        date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
};

export default function RecentTransactionsTable() {
    const theme = useTheme();
    const [page, setPage] = useState(0);
    const limit = 5;
    const { data, loading } = useRecentTransactions({ page, limit });
    const result = data?.recentTransactions;

    const pageCount = result ? Math.max(1, Math.ceil(result.total / limit)) : 1;

    return (
        <MainCard title="Recent Transactions" contentSX={{ p: 0 }}>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>User</TableCell>
                            <TableCell>User Type</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Date & Time</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading && !result
                            ? Array.from({ length: limit }).map((_, i) => (
                                  <TableRow key={i}>
                                      <TableCell colSpan={8}>
                                          <Skeleton height={40} />
                                      </TableCell>
                                  </TableRow>
                              ))
                            : result?.data.map((tx) => {
                                  const { date, time } = formatDateTime(tx.createdAt);
                                  const initials = (tx.user.fullName ?? '?')
                                      .split(' ')
                                      .map((n) => n[0])
                                      .slice(0, 2)
                                      .join('')
                                      .toUpperCase();

                                  return (
                                      <TableRow key={tx.id} hover>
                                          <TableCell>
                                              <Typography variant="subtitle2">{tx.id}</Typography>
                                          </TableCell>
                                          <TableCell>
                                              <Chip
                                                  label={tx.type.replace('_', ' ')}
                                                  size="small"
                                                  color={typeChipColor[tx.type]}
                                                  variant="outlined"
                                              />
                                          </TableCell>
                                          <TableCell>
                                              <Box display="flex" alignItems="center" gap={1}>
                                                  <Avatar
                                                      sx={{ width: 28, height: 28, fontSize: 12, bgcolor: theme.palette.primary.light }}
                                                  >
                                                      {initials}
                                                  </Avatar>
                                                  <Box>
                                                      <Typography variant="body2">{tx.user.fullName ?? '—'}</Typography>
                                                      <Typography variant="caption" color="textSecondary">
                                                          ID: {tx.user.displayId ?? '—'}
                                                      </Typography>
                                                  </Box>
                                              </Box>
                                          </TableCell>
                                          <TableCell>
                                              <Chip label={tx.user.userType ?? '—'} size="small" variant="outlined" />
                                          </TableCell>
                                          <TableCell>
                                              <Typography variant="body2" color="textSecondary">
                                                  {tx.description ?? '—'}
                                              </Typography>
                                          </TableCell>
                                          <TableCell>
                                              <Typography
                                                  variant="subtitle2"
                                                  sx={{
                                                      color:
                                                          tx.direction === 'DEBIT' ? theme.palette.error.main : theme.palette.success.dark
                                                  }}
                                              >
                                                  {formatCurrency(tx.amount, tx.direction)}
                                              </Typography>
                                          </TableCell>
                                          <TableCell>
                                              <Chip label={tx.status} size="small" color={statusChipColor[tx.status]} />
                                          </TableCell>
                                          <TableCell>
                                              <Typography variant="body2">{date}</Typography>
                                              <Typography variant="caption" color="textSecondary">
                                                  {time}
                                              </Typography>
                                          </TableCell>
                                      </TableRow>
                                  );
                              })}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
                <Typography variant="body2" color="textSecondary">
                    Showing {result ? page * limit + 1 : 0} to {result ? Math.min((page + 1) * limit, result.total) : 0} of{' '}
                    {result?.total ?? 0} transactions
                </Typography>
                <Pagination count={pageCount} page={page + 1} onChange={(_, value) => setPage(value - 1)} color="primary" shape="rounded" />
            </Box>
        </MainCard>
    );
}
