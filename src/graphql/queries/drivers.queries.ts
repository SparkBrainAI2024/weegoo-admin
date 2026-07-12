// graphql/driver.queries.ts
import { gql } from '@apollo/client';
import { DriverListItem } from 'types/drivers.types';

export const GET_DRIVERS = gql`
    query GetDrivers($input: DriverListInput) {
        getDrivers(input: $input) {
            data {
                id
                fullName
                suspended
                joinedDate
                totalRides
                totalEarnings
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

export type DriverStatus = 'all' | 'active' | 'suspended';

export interface DriverListInput {
    page: number;
    limit: number;
    status?: DriverStatus;
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

export interface GetDriversQueryResult {
    getDrivers: {
        data: DriverListItem[];
        pagination: Pagination;
    };
}
