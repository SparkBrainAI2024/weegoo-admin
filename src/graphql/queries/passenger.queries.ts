// graphql/driver.queries.ts
import { gql } from '@apollo/client';
import { PassengerListItem } from 'types/passengers.types';

export const GET_PASSENGERS = gql`
    query GetPassengers($input: PassengerListInput) {
        getPassengers(input: $input) {
            data {
                id
                fullName
                suspended
                joinedDate
                totalTripsAsPassenger
                totalSpendingOnRides
                phone
                status
                rating
                profileImage
            }
            pagination {
                page
                limit
                hasNextPage
                hasPreviousPage
                nextPage
                previousPage
                total
            }
        }
    }
`;

export type PassengerStatus = 'all' | 'active' | 'suspended';

export interface PassengerListInput {
    page: number;
    limit: number;
    status?: PassengerStatus;
    search?: string;
}

export interface Pagination {
    page: number;
    limit: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nextPage?: number;
    previousPage?: number;
    total: number;
}

export interface GetPassengersQueryResult {
    getPassengers: {
        data: PassengerListItem[];
        pagination: Pagination;
    };
}
