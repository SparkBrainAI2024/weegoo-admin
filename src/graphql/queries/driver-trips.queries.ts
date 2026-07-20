import { gql } from '@apollo/client';

export interface DriverTripRow {
    id: string;
    rideUUId: string;
    createdAt: string;
    pickupLocation?: string;
    dropoffLocation?: string;
    fare: number;
    paymentMethod?: string;
    driverCommission?: number;
    driverGets?: number;
    status?: string | null;
}

export interface DriverTripsPagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface DriverTripsQuery {
    driverTrips: {
        data: DriverTripRow[];
        pagination: DriverTripsPagination;
    };
}

export interface DriverTripsQueryVariables {
    driverId: string;
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    orderBy?: string;
    order?: string;
}

export interface DriverCommissionSummary {
    outstandingToPay: number;
    commissionPaid?: number | null;
    totalRides: number;
    lastSettlementDate?: string | null;
    lastSettlementAmount?: number | null;
    lastSettlementMethod?: string | null;
}

export interface DriverCommissionSummaryQuery {
    driverCommissionSummary: DriverCommissionSummary;
}

export interface DriverCommissionSummaryQueryVariables {
    driverId: string;
}

export const GET_DRIVER_TRIPS = gql`
    query DriverTrips($driverId: ID!, $page: Int, $limit: Int, $search: String, $status: String, $orderBy: String, $order: String) {
        driverTrips(driverId: $driverId, page: $page, limit: $limit, search: $search, status: $status, orderBy: $orderBy, order: $order) {
            data {
                id
                rideUUId
                createdAt
                pickupLocation
                dropoffLocation
                fare
                paymentMethod
                driverCommission
                driverGets
                status
            }
            pagination {
                total
                page
                limit
                totalPages
            }
        }
    }
`;

export const GET_DRIVER_COMMISSION_SUMMARY = gql`
    query DriverCommissionSummary($driverId: ID!) {
        driverCommissionSummary(driverId: $driverId) {
            outstandingToPay
            commissionPaid
            totalRides
            lastSettlementDate
            lastSettlementAmount
            lastSettlementMethod
        }
    }
`;
