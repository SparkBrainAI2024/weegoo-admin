import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';

// ---- Query -------------------------------------------------------------

export const RIDE_DETAIL_QUERY = gql`
    query Ride($id: String!) {
        ride(id: $id) {
            id
            rideUUId
            rideStatus
            bookingTime
            rideStartedAt
            rideCompletedAt
            distanceInKm
            estimatedTimeInMinutes
            pickupLocation {
                address
            }
            dropoffLocation {
                address
            }
            paymentDetails {
                baseAmount
                distanceAmount
                totalAmount
                subTotal
                discountAmount
                promoCodeName
                paymentMethod
                paymentStatus
            }
            passenger {
                fullName
                phone
                rating
                profileImage
                totalTripsAsPassenger
            }
            driver {
                fullName
                phone
                rating
                profileImage
                totalRidesAsDriver
            }
            vehicle {
                vehicleModel
                color
                numberPlate
            }
        }
    }
`;

// ---- Fetch hook -------------------------------------------------------------
// Single-record fetch, no param-builder needed — id is the only input.

export const useRideDetail = (id: string) => {
    return useQuery(RIDE_DETAIL_QUERY, {
        variables: { id },
        skip: !id
    });
};

// ---- Types -----------------------------------------------------------

export enum RideStatus {
    CONFIRMED = 'CONFIRMED',
    ONGOING = 'ONGOING',
    PICKUP = 'PICKUP',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
    PENDING = 'PENDING'
}

export enum RideTimeRange {
    LAST_24_HOURS = 'LAST_24_HOURS',
    LAST_7_DAYS = 'LAST_7_DAYS',
    LAST_30_DAYS = 'LAST_30_DAYS'
}

export interface RidesListInput {
    page: number;
    limit: number;
    status?: RideStatus;
    timeRange: RideTimeRange;
    search?: string;
}

// ---- Query -------------------------------------------------------------

export const RIDES_QUERY = gql`
    query Rides($input: RidesListInput!) {
        rides(input: $input) {
            rides {
                _id
                rideUUId
                rideStatus
                bookingTime
                pickupLocation {
                    address
                }
                dropoffLocation {
                    address
                }
                paymentDetails {
                    totalAmount
                }
                passenger {
                    fullName
                }
                driver {
                    fullName
                }
            }
            total
            page
            limit
        }
    }
`;

// ---- Param builder -------------------------------------------------------------
// Mirrors getDriverList's job: normalize raw filter values into the shape the
// query expects (defaults, empty-string-to-undefined). Unlike getDriverList this
// doesn't build a URL string — GraphQL has no querystring, Apollo keys its cache
// off query + variables instead.

export const buildRidesListInput = ({
    page,
    perPage,
    status,
    timeRange,
    search
}: {
    page?: number;
    perPage?: number;
    status?: RideStatus | '';
    timeRange?: RideTimeRange;
    search?: string;
}): RidesListInput => {
    return {
        page: page ?? 1,
        limit: perPage ?? 10,
        status: status || undefined,
        timeRange: timeRange ?? RideTimeRange.LAST_24_HOURS,
        search: search || undefined
    };
};

// ---- Fetch hook -------------------------------------------------------------
// Thin useQuery wrapper. No useLazyQuery/useEffect — changing the URL-derived
// params changes buildRidesListInput's output, which changes the query
// variables, which Apollo refetches on automatically.

export const useRidesList = (params: Parameters<typeof buildRidesListInput>[0]) => {
    const input = buildRidesListInput(params);
    return useQuery<RidesQueryResult>(RIDES_QUERY, { variables: { input } });
};
export interface RideListItem {
    id: string;
    rideUUId: string;
    rideStatus: RideStatus;
    bookingTime: string;
    pickupLocation?: { address?: string };
    dropoffLocation?: { address?: string };
    paymentDetails?: { totalAmount?: number };
    passenger?: { fullName?: string };
    driver?: { fullName?: string };
}

export interface RidesQueryResult {
    rides: {
        rides: RideListItem[];
        total: number;
        page: number;
        limit: number;
    };
}
