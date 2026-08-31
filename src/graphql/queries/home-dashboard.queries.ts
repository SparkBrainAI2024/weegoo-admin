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

// graphql/queries/dashboard.queries.ts — add to existing file
export interface RideStatusChartStats {
    ongoing: number;
    cancelled: number;
    completed: number;
}

export interface RideStatusChartResponse {
    rideStatusChart: RideStatusChartStats;
}

export const RIDE_STATUS_CHART_QUERY = gql`
    query RideStatusChart($input: AdminDashboardInput!) {
        rideStatusChart(input: $input) {
            ongoing
            cancelled
            completed
        }
    }
`;

export const useRideStatusChart = (input: AdminDashboardInput = { fromDate: null, endDate: null }) => {
    return useQuery<RideStatusChartResponse, AdminDashboardVariables>(RIDE_STATUS_CHART_QUERY, {
        variables: { input }
    });
};

// graphql/queries/dashboard.queries.ts — add to existing file
export interface ChartDataPoint {
    label: string;
    value: number;
}

export interface CompletedRideDashboardChart {
    data: ChartDataPoint[];
    groupBy: string;
    total: number;
}

export interface CompletedRideChartResponse {
    getCompletedRideDashboardChart: CompletedRideDashboardChart;
}

export const GET_COMPLETED_RIDE_CHART_QUERY = gql`
    query GetCompletedRideDashboardChart($input: AdminDashboardInput!) {
        getCompletedRideDashboardChart(input: $input) {
            data {
                label
                value
            }
            groupBy
            total
        }
    }
`;

export const useCompletedRideChart = (input: AdminDashboardInput = { fromDate: null, endDate: null }) => {
    return useQuery<CompletedRideChartResponse, AdminDashboardVariables>(GET_COMPLETED_RIDE_CHART_QUERY, {
        variables: { input }
    });
};
// graphql/queries/dashboard.queries.ts — add to existing file
export interface PassengerRegistrationChartResponse {
    passengerRegistrationChart: CompletedRideDashboardChart; // same shape: { data, groupBy, total }
}

export const PASSENGER_REGISTRATION_CHART_QUERY = gql`
    query PassengerRegistrationChart($input: AdminDashboardInput) {
        passengerRegistrationChart(input: $input) {
            data {
                label
                value
            }
            groupBy
            total
        }
    }
`;

export const usePassengerRegistrationChart = (input: AdminDashboardInput = { fromDate: null, endDate: null }) => {
    return useQuery<PassengerRegistrationChartResponse, AdminDashboardVariables>(PASSENGER_REGISTRATION_CHART_QUERY, {
        variables: { input }
    });
};
// graphql/queries/dashboard.queries.ts — add to existing file
export interface DriverStatusCounts {
    totalDrivers: number;
    onlineDrivers: number;
    offlineDrivers: number;
}

export interface DriverStatusCountsResponse {
    driverStatusCounts: DriverStatusCounts;
}

export const DRIVER_STATUS_COUNTS_QUERY = gql`
    query DriverStatusCounts {
        driverStatusCounts {
            totalDrivers
            onlineDrivers
            offlineDrivers
        }
    }
`;

export const useDriverStatusCounts = () => {
    return useQuery<DriverStatusCountsResponse>(DRIVER_STATUS_COUNTS_QUERY);
};
// graphql/queries/dashboard.queries.ts — add to existing file
export interface TotalRidersChart {
    totalNoOfUsers: number;
    usersJoinedToday: number;
    blockedUsers: number;
}

export interface TotalRidersChartResponse {
    getTotalRidersChart: TotalRidersChart;
}

export const GET_TOTAL_RIDERS_CHART_QUERY = gql`
    query GetTotalRidersChart {
        getTotalRidersChart {
            totalNoOfUsers
            usersJoinedToday
            blockedUsers
        }
    }
`;

export const useTotalRidersChart = () => {
    return useQuery<TotalRidersChartResponse>(GET_TOTAL_RIDERS_CHART_QUERY);
};
// graphql/queries/dashboard.queries.ts — add to existing file
export interface HighPriorityIssueItem {
    id: string;
    ticketCode: string;
    createdAt: string;
    reportedByName: string;
    reportedByType: string;
    rideId?: string | null;
    categoryLabel: string;
    status: string;
    priority: string;
    issueContent: string;
}

export interface GetHighPriorityIssuesResult {
    items: HighPriorityIssueItem[];
    total: number;
}

export interface GetHighPriorityIssuesResponse {
    getHighPriorityIssues: GetHighPriorityIssuesResult;
}

export const GET_HIGH_PRIORITY_ISSUES_QUERY = gql`
    query GetHighPriorityIssues {
        getHighPriorityIssues {
            items {
                id
                ticketCode
                createdAt
                reportedByName
                reportedByType
                rideId
                categoryLabel
                status
                priority
                issueContent
            }
            total
        }
    }
`;

export const useHighPriorityIssues = () => {
    return useQuery<GetHighPriorityIssuesResponse>(GET_HIGH_PRIORITY_ISSUES_QUERY);
};
