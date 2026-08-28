// graphql/queries/dashboard.queries.ts
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

export interface AdminDashboardInput {
    fromDate?: string | null;
    endDate?: string | null;
}

export interface PercentageChange {
    totalActiveRides: number;
    activeRider: number;
    activePassenger: number;
    totalRevenue: number;
    completeCommissionTransactions: number;
    totalCancelledRides: number;
}

export interface AdminDashboardStats {
    totalActiveRides: number;
    activeRider: number;
    activePassenger: number;
    totalRevenue: number;
    completeCommissionTransactions: number;
    totalCancelledRides: number;
    percentageChange: PercentageChange;
}

export interface AdminDashboardResponse {
    adminDashboard: AdminDashboardStats;
}

export interface AdminDashboardVariables {
    input: AdminDashboardInput;
}

export const ADMIN_DASHBOARD_QUERY = gql`
    query AdminDashboard($input: AdminDashboardInput!) {
        adminDashboard(input: $input) {
            totalActiveRides
            activeRider
            activePassenger
            totalRevenue
            completeCommissionTransactions
            totalCancelledRides
            percentageChange {
                totalActiveRides
                activeRider
                activePassenger
                totalRevenue
                completeCommissionTransactions
                totalCancelledRides
            }
        }
    }
`;

export const useAdminDashboard = (input: AdminDashboardInput = { fromDate: null, endDate: null }) => {
    return useQuery<AdminDashboardResponse, AdminDashboardVariables>(ADMIN_DASHBOARD_QUERY, {
        variables: { input }
    });
};
