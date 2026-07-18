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

export const GET_RIDER_OVERVIEW = gql`
    query GetRiderOverview($riderId: String!) {
        getRiderOverview(riderId: $riderId) {
            id
            fullName
            profileImage
            phone
            email
            suspended
            joinedDate
            lastActive
            phoneVerified
        }
    }
`;

export const GET_RIDER_TRIPS = gql`
    query GetRiderTrips($input: RiderTripsInput!) {
        getRiderTrips(input: $input) {
            data {
                id
                rideUUId
                createdAt
                pickupLocation
                dropoffLocation
                fare
                paymentMethod
                status
            }
            summary {
                totalTrips
                completed
                cancelled
                totalSpend
                avgFare
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

export const GET_RIDER_RATINGS = gql`
    query GetRiderRatings($input: RiderRatingsInput!) {
        getRiderRatings(input: $input) {
            averageRating
            totalReviews
            breakdown {
                fiveStar
                fourStar
                threeStar
                twoStar
                oneStar
            }
            data {
                rideId
                rideUUId
                pickup
                drop
                fare
                driverName
                driverShortId
                createdAt
                rating
                review
                feedbackTags
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
