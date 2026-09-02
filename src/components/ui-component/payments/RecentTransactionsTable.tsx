import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Avatar, Box, Chip, Pagination, Typography } from '@mui/material';
import { Column, DataTable } from 'components/ui-component/DataTable';
import { TransactionStatus, TransactionType, useRecentTransactions } from 'graphql/queries/payments.queries';
import MainCard from '../cards/MainCard';
import { SpaciousChipContainer } from '../SpaciousChipContainer';

const formatCurrency = (value: number, direction: 'DEBIT' | 'CREDIT') =>
    `${direction === 'DEBIT' ? '-' : '+'}Rs. ${Math.abs(value).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

const typeConfig: Record<TransactionType, { label: string; color: string }> = {
    [TransactionType.COMMISSION]: { label: 'Commission', color: '#2e7d32' },
    [TransactionType.TOPUP]: { label: 'Topup', color: '#1976d2' },
    [TransactionType.RIDE_PAYMENT]: { label: 'Wallet Payment', color: '#7b1fa2' },
    [TransactionType.WITHDRAWAL]: { label: 'Withdrawal', color: '#ed6c02' }
};

const statusChipColor: Record<TransactionStatus, 'success' | 'warning' | 'error'> = {
    [TransactionStatus.COMPLETED]: 'success',
    [TransactionStatus.PENDING]: 'warning',
    [TransactionStatus.FAILED]: 'error'
};

const userTypeColor: Record<string, string> = {
    DRIVER: '#2e7d32',
    PASSENGER: '#1976d2'
};

const formatDateTime = (iso: string) => {
    const d = new Date(iso);
    return {
        date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
};

interface TransactionRow {
    id: string;
    type: TransactionType;
    user: { fullName?: string; displayId?: string; userType?: string };
    description?: string;
    amount: number;
    direction: 'DEBIT' | 'CREDIT';
    status: TransactionStatus;
    createdAt: string;
}

export default function RecentTransactionsTable() {
    const theme = useTheme();
    const [page, setPage] = useState(0);
    const limit = 5;
    const { data, loading } = useRecentTransactions({ page, limit });
    const result = data?.recentTransactions;
    const rows: TransactionRow[] = result?.data ?? [];
    const pageCount = result ? Math.max(1, Math.ceil(result.total / limit)) : 1;

    const columns: Column<TransactionRow>[] = [
        {
            key: 'id',
            header: 'ID',
            width: '12%',
            render: (row) => <Typography sx={{ fontSize: 11, fontWeight: 600 }}>{row.id}</Typography>
        },
        {
            key: 'type',
            header: 'TYPE',
            width: '10%',
            render: (row) => (
                <Box display="flex" alignItems="center" gap={0.75} sx={{ whiteSpace: 'normal' }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: typeConfig[row.type].color, flexShrink: 0 }} />
                    <Typography sx={{ fontSize: 10 }}>{typeConfig[row.type].label}</Typography>
                </Box>
            )
        },
        {
            key: 'user',
            header: 'USER',
            width: '16%',
            render: (row) => {
                const initials = (row.user.fullName ?? '?')
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase();
                const utColor = userTypeColor[row.user.userType ?? ''] ?? theme.palette.text.secondary;
                return (
                    <Box display="flex" alignItems="center" gap={1} sx={{ whiteSpace: 'nowrap' }}>
                        <Avatar sx={{ width: 28, height: 28, fontSize: 11, bgcolor: `${utColor}22`, color: utColor, flexShrink: 0 }}>
                            {initials}
                        </Avatar>
                        <Box>
                            <Typography sx={{ fontSize: 11, fontWeight: 600 }}>{row.user.fullName ?? '—'}</Typography>
                            <Typography sx={{ fontSize: 10, color: 'text.secondary' }}>ID: {row.user.displayId ?? '—'}</Typography>
                        </Box>
                    </Box>
                );
            }
        },
        {
            key: 'userType',
            header: 'USER TYPE',
            width: '10%',
            render: (row) => (
                <Typography
                    sx={{
                        fontSize: 10,
                        whiteSpace: 'normal',
                        color: userTypeColor[row.user.userType ?? ''] ?? theme.palette.text.secondary
                    }}
                >
                    {row.user.userType ?? '—'}
                </Typography>
            )
        },
        {
            key: 'description',
            header: 'DESCRIPTION',
            width: '18%',
            render: (row) => (
                <Typography sx={{ fontSize: 10, whiteSpace: 'normal', color: 'text.secondary' }}>{row.description ?? '—'}</Typography>
            )
        },
        {
            key: 'amount',
            header: 'AMOUNT',
            width: '10%',
            render: (row) => (
                <Typography
                    sx={{
                        fontSize: 11,
                        fontWeight: 600,
                        whiteSpace: 'normal',
                        color: row.direction === 'DEBIT' ? theme.palette.error.main : theme.palette.success.dark
                    }}
                >
                    {formatCurrency(row.amount, row.direction)}
                </Typography>
            )
        },
        {
            key: 'status',
            header: 'STATUS',
            width: '10%',
            render: (row) => <SpaciousChipContainer label={row.status} color={statusChipColor[row.status]} />
        },
        {
            key: 'dateTime',
            header: 'DATE & TIME',
            width: '14%',
            render: (row) => {
                const { date, time } = formatDateTime(row.createdAt);
                return (
                    <Box sx={{ whiteSpace: 'normal' }}>
                        <Typography sx={{ fontSize: 11, fontWeight: 600 }}>{date}</Typography>
                        <Typography sx={{ fontSize: 10, color: 'text.secondary' }}>{time}</Typography>
                    </Box>
                );
            }
        }
    ];

    return (
        <MainCard
            sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                '& .MuiCardContent-root': { px: '0px', py: '0px' }
            }}
            contentSX={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}
        >
            <Box sx={{ px: 3, pt: 3, pb: 2 }}>
                <Typography variant="h3" fontWeight={500}>
                    Recent Transactions
                </Typography>
            </Box>
            <DataTable columns={columns} rows={rows} loading={loading} getRowKey={(row) => row.id} />
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
