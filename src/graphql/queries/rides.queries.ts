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
                type
                coordinates
            }
            dropoffLocation {
                address
                type
                coordinates
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
    _id: string;
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

export interface RideLocationInfo {
    address?: string;
    fullAddress?: string;
    city?: string;
    district?: string;
    province?: string;
    coordinates: number[];
    type: string;
}

export interface FareInfo {
    baseAmount: number;
    trafficCongestionAmount: number;
    distanceAmount: number;
    totalAmount: number;
    subTotal: number;
    discountAmount: number;
    promoCodeName?: string;
}

export interface PaymentDetailsInfo {
    totalAmount: number;
    subTotal: number;
    discountAmount: number;
    promoCodeName?: string;
    paymentMethod?: string;
    paymentStatus?: string;
    paymentFailedReason?: string;
    driverCommission: number;
}

export interface VehicleInfo {
    model?: string;
    plateNumber?: string;
    color?: string;
    vehicleType?: string;
}

export interface RideUserSnapshotInfo {
    userId: string;
    fullName: string;
    displayId: string;
    email: string;
    phone: string;
    profileImage?: string;
    rating: number;
    suspended: boolean;
    totalRidesAsDriver?: number;
    totalTripsAsPassenger?: number;
}

export interface RideDetail {
    id: string;
    rideUUId?: string;
    rideType: string;
    rideStatus: RideStatus;
    bookingTime: string;
    rideStartedAt?: string;
    rideCompletedAt?: string;
    distanceInKm?: number;
    durationInMinutes?: number;
    waitTimeInMinutes?: number;
    pickupLocation: RideLocationInfo;
    dropoffLocation: RideLocationInfo;
    fare?: FareInfo;
    paymentDetails?: PaymentDetailsInfo;
    platformCommissionAmount?: number;
    driverEarningsAmount?: number;
    vehicle?: VehicleInfo;
    driver?: RideUserSnapshotInfo;
    passenger?: RideUserSnapshotInfo;
}

export interface GetRideDetailResponse {
    rideDetail: RideDetail;
}

export interface GetRideDetailVariables {
    input: {
        id: string;
    };
}

export interface VehicleInfo {
    name?: string;
    vehicleModel?: string;
    year?: number;
    color?: string;
    numberPlate?: string;
    vehicleType?: string;
}

export const GET_RIDE_DETAIL = gql`
    query RideDetail($input: RideDetailInput!) {
        rideDetail(input: $input) {
            id
            rideUUId
            rideType
            rideStatus
            bookingTime
            rideStartedAt
            rideCompletedAt
            distanceInKm
            durationInMinutes
            waitTimeInMinutes

            pickupLocation {
                address
                fullAddress
                city
                district
                province
                type
                coordinates
            }
            dropoffLocation {
                address
                fullAddress
                city
                district
                province
                type
                coordinates
            }

            fare {
                baseAmount
                trafficCongestionAmount
                distanceAmount
                totalAmount
                subTotal
                discountAmount
                promoCodeName
            }

            paymentDetails {
                totalAmount
                subTotal
                discountAmount
                promoCodeName
                paymentMethod
                paymentStatus
                paymentFailedReason
                driverCommission
            }

            platformCommissionAmount
            driverEarningsAmount
            vehicle {
                name
                vehicleModel
                year
                color
                numberPlate
                vehicleType
            }

            driver {
                userId
                fullName
                displayId
                email
                phone
                profileImage
                rating
                suspended
                totalRidesAsDriver
            }

            passenger {
                userId
                fullName
                displayId
                email
                phone
                profileImage
                rating
                suspended
                totalTripsAsPassenger
            }
        }
    }
`;
