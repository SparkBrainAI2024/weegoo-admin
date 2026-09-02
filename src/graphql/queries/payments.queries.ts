import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { TimeRangeFilter } from 'types/enum';

// ---- Enums / shared types -----------------------------------------------

export enum TransactionType {
    RIDE_PAYMENT = 'RIDE_PAYMENT',
    TOPUP = 'TOPUP',
    WITHDRAWAL = 'WITHDRAWAL',
    COMMISSION = 'COMMISSION'
}

export enum TransactionStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED'
}

export enum TransactionDirection {
    DEBIT = 'DEBIT',
    CREDIT = 'CREDIT'
}

export interface PaymentsOverviewInput {
    fromDate: string | null;
    endDate: string | null;
}

export const buildPaymentsOverviewInput = ({
    fromDate,
    endDate
}: {
    fromDate: string | null;
    endDate: string | null;
}): PaymentsOverviewInput => {
    return {
        fromDate,
        endDate
    };
};

// ---- Stat card shape -------------------------------------------------------

export interface StatCard {
    value: number;
    percentChange?: number;
    isIncrease?: boolean;
}

// ---- Payments summary -----------------------------------------------------

export const PAYMENTS_SUMMARY_QUERY = gql`
    query PaymentsSummary {
        paymentsSummary {
            totalCommission {
                value
                percentChange
                isIncrease
            }
            driverWalletBalance {
                value
            }
            customerWalletBalance {
                value
            }
            totalTransactions {
                value
                percentChange
                isIncrease
            }
        }
    }
`;

export interface PaymentsSummaryResponse {
    paymentsSummary: {
        totalCommission: StatCard;
        driverWalletBalance: StatCard;
        customerWalletBalance: StatCard;
        totalTransactions: StatCard;
    };
}

export const usePaymentsSummary = () => {
    return useQuery<PaymentsSummaryResponse>(PAYMENTS_SUMMARY_QUERY, {});
};

// ---- Commission overview (line chart) --------------------------------------

export const COMMISSION_OVERVIEW_QUERY = gql`
    query CommissionOverview($input: PaymentsOverviewInput) {
        commissionOverview(input: $input) {
            totalCommission
            percentChange
            dataPoints {
                date
                amount
            }
        }
    }
`;

export interface ChartPoint {
    date: string;
    amount: number;
}

export interface CommissionOverviewResponse {
    totalCommission: number;
    percentChange?: number;
    dataPoints: ChartPoint[];
}

export const useCommissionOverview = (filter: { filter: TimeRangeFilter }) => {
    return useQuery<{ commissionOverview: CommissionOverviewResponse }>(COMMISSION_OVERVIEW_QUERY, {
        variables: { input: { period: filter.filter } }
    });
};

// ---- Wallet balances (donut) ------------------------------------------------

export const WALLET_BALANCES_QUERY = gql`
    query WalletBalances {
        walletBalances {
            totalBalance
            driverWallet {
                label
                value
                percentage
            }
            customerWallet {
                label
                value
                percentage
            }
            commission {
                label
                value
                percentage
            }
        }
    }
`;

export interface WalletBalanceSegment {
    label: string;
    value: number;
    percentage: number;
}

export interface WalletBalancesResponse {
    walletBalances: {
        totalBalance: number;
        driverWallet: WalletBalanceSegment;
        customerWallet: WalletBalanceSegment;
        commission: WalletBalanceSegment;
    };
}

export const useWalletBalances = () => {
    return useQuery<WalletBalancesResponse>(WALLET_BALANCES_QUERY);
};

// ---- Topup vs withdrawals ---------------------------------------------------

export const TOPUP_WITHDRAWAL_QUERY = gql`
    query TopupVsWithdrawals($input: PaymentsOverviewInput) {
        topupVsWithdrawals(input: $input) {
            totalTopups {
                value
                percentChange
                isIncrease
            }
            totalWithdrawals {
                value
                percentChange
                isIncrease
            }
            netFlow
            netFlowPercentChange
        }
    }
`;

export interface TopupWithdrawalResponse {
    totalTopups: StatCard;
    totalWithdrawals: StatCard;
    netFlow: number;
    netFlowPercentChange?: number;
    netFlowTrend?: ChartPoint[];
}

export const useTopupVsWithdrawals = (filter: TimeRangeFilter) => {
    return useQuery<{ topupVsWithdrawals: TopupWithdrawalResponse }>(TOPUP_WITHDRAWAL_QUERY, {
        variables: { input: { period: filter } }
    });
};

// ---- Recent transactions (table) -------------------------------------------

export interface RecentTransactionsInput extends PaymentsOverviewInput {
    page?: number;
    limit?: number;
    type?: TransactionType;
    status?: TransactionStatus;
    searchText?: string;
}

export const buildRecentTransactionsInput = ({
    page,
    limit,
    type,
    status,
    searchText,
    fromDate,
    endDate
}: {
    page?: number;
    limit?: number;
    type?: TransactionType | '';
    status?: TransactionStatus | '';
    searchText?: string;
    fromDate: string | null;
    endDate: string | null;
}): RecentTransactionsInput => {
    return {
        page: page ?? 0,
        limit: limit ?? 5,
        type: type || undefined,
        status: status || undefined,
        searchText: searchText || undefined,
        fromDate,
        endDate
    };
};

export const RECENT_TRANSACTIONS_QUERY = gql`
    query RecentTransactions($input: RecentTransactionsInput) {
        recentTransactions(input: $input) {
            data {
                id
                type
                user {
                    userId
                    fullName
                    displayId
                    userType
                }
                description
                amount
                direction
                status
                createdAt
            }
            total
            page
            limit
            hasNextPage
            hasPreviousPage
        }
    }
`;

export interface TransactionUserInfo {
    userId?: string;
    fullName?: string;
    displayId?: string;
    userType?: 'DRIVER' | 'PASSENGER' | 'ADMIN';
}

export interface TransactionRow {
    id: string;
    type: TransactionType;
    user: TransactionUserInfo;
    description?: string;
    amount: number;
    direction: TransactionDirection;
    status: TransactionStatus;
    createdAt: string;
}

export interface RecentTransactionsResponse {
    recentTransactions: {
        data: TransactionRow[];
        total: number;
        page: number;
        limit: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
}

export const useRecentTransactions = (params: Parameters<typeof buildRecentTransactionsInput>[0]) => {
    const input = buildRecentTransactionsInput(params);
    return useQuery<RecentTransactionsResponse>(RECENT_TRANSACTIONS_QUERY, { variables: { input } });
};

// ---- Pending withdrawals ----------------------------------------------------

export const PENDING_WITHDRAWALS_QUERY = gql`
    query PendingWithdrawals {
        pendingWithdrawals {
            data {
                id
                fullName
                displayId
                amount
                status
                requestedAt
            }
            totalPending
        }
    }
`;

export interface PendingWithdrawalItem {
    id: string;
    fullName?: string;
    displayId?: string;
    amount: number;
    status: TransactionStatus;
    requestedAt: string;
}

export interface PendingWithdrawalsResponse {
    pendingWithdrawals: {
        data: PendingWithdrawalItem[];
        totalPending: number;
    };
}

export const usePendingWithdrawals = () => {
    return useQuery<PendingWithdrawalsResponse>(PENDING_WITHDRAWALS_QUERY);
};
