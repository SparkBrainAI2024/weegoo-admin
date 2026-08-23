import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';

// ---- Enums / shared types -----------------------------------------------

export enum PaymentsPeriod {
    TODAY = 'TODAY',
    THIS_WEEK = 'THIS_WEEK',
    THIS_MONTH = 'THIS_MONTH',
    THIS_YEAR = 'THIS_YEAR',
    CUSTOM = 'CUSTOM'
}

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
    period?: PaymentsPeriod;
    startDate?: string;
    endDate?: string;
}

export const buildPaymentsOverviewInput = ({ period }: { period?: PaymentsPeriod }): PaymentsOverviewInput => {
    return {
        period: period ?? PaymentsPeriod.THIS_MONTH
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
    query PaymentsSummary($input: PaymentsOverviewInput) {
        paymentsSummary(input: $input) {
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

export const usePaymentsSummary = (period: PaymentsPeriod) => {
    const input = buildPaymentsOverviewInput({ period });
    return useQuery<PaymentsSummaryResponse>(PAYMENTS_SUMMARY_QUERY, { variables: { input } });
};

// ---- Commission overview (line chart) --------------------------------------

export const COMMISSION_OVERVIEW_QUERY = gql`
    query CommissionOverview($input: PaymentsOverviewInput) {
        commissionOverview(input: $input) {
            totalCommission
            percentChange
            series {
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
    commissionOverview: {
        totalCommission: number;
        percentChange?: number;
        series: ChartPoint[];
    };
}

export const useCommissionOverview = (period: PaymentsPeriod) => {
    const input = buildPaymentsOverviewInput({ period });
    return useQuery<CommissionOverviewResponse>(COMMISSION_OVERVIEW_QUERY, { variables: { input } });
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
            netFlowTrend {
                date
                amount
            }
        }
    }
`;

export interface TopupWithdrawalResponse {
    topupVsWithdrawals: {
        totalTopups: StatCard;
        totalWithdrawals: StatCard;
        netFlow: number;
        netFlowPercentChange?: number;
        netFlowTrend?: ChartPoint[];
    };
}

export const useTopupVsWithdrawals = (period: PaymentsPeriod) => {
    const input = buildPaymentsOverviewInput({ period });
    return useQuery<TopupWithdrawalResponse>(TOPUP_WITHDRAWAL_QUERY, { variables: { input } });
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
    searchText
}: {
    page?: number;
    limit?: number;
    type?: TransactionType | '';
    status?: TransactionStatus | '';
    searchText?: string;
}): RecentTransactionsInput => {
    return {
        page: page ?? 0,
        limit: limit ?? 5,
        type: type || undefined,
        status: status || undefined,
        searchText: searchText || undefined
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
