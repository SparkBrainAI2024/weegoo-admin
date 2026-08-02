// graphql/driver.queries.ts
import { gql } from '@apollo/client';
import { TypedDocumentNode } from '@apollo/client';

import { DriverListItem } from 'types/drivers.types';

export const GET_DRIVERS = gql`
    query GetDrivers($input: DriverListInput) {
        getDrivers(input: $input) {
            data {
                id
                fullName
                suspended
                joinedDate
                totalRidesAsDriver
                totalEarnings
                phone
                status
                rating
                profileImage
            }
            totalPending
            totalBlocked
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

export interface GetDriverQueryResult {
    getDriver: {
        data: DriverListItem[];
    };
}

/**
 * IMPORTANT CONTEXT (as of now):
 *
 * The backend only exposes ONE resolver: getDriver(driverId).
 * It returns driver + documents[] + vehicle all nested in one response,
 * as shown in the real payload we're matching field names against.
 *
 * There is NOT yet a separate getDriverDocuments / getDriverOverview
 * resolver on the server. So what follows is "split by field selection,
 * same operation" — not "split by resolver" (that's the later step,
 * once/if the backend adds dedicated resolvers).
 *
 * Why still bother splitting selections now instead of one giant query:
 *   - Smaller payload per request (GraphQL only returns selected fields,
 *     even though the resolver internally still fetches everything).
 *   - You can still defer firing GET_DRIVER_DOCUMENTS until the
 *     Documents tab opens (useLazyQuery) — no backend compute is saved,
 *     but you save the round trip + parse/render cost until it's needed.
 *   - Apollo's normalized cache merges both results into the same
 *     Driver:<id> entity, since both queries request `id` and resolve
 *     to the same __typename. So a field selected by one query is
 *     visible to a component that only ran the other query, once both
 *     have executed at least once.
 *   - When the backend DOES split into real resolvers later, this
 *     frontend code doesn't need to change shape — only the `query`
 *     name/operation changes from getDriver to getDriverDocuments etc.
 */

export interface DriverDocumentFile {
    side: string;
    s3Key: string;
    isActive: boolean;
    status: string;
    downloadUrl: string;
    verifiedBy: string | null;
    verifiedAt: string | null;
    createdAt: string;
    _id: string;
}

export interface DriverDocument {
    _id: string;
    type: string;
    status: string;
    rejectionReason: string | null;
    reviewedBy: string | null;
    reviewedAt: string | null;
    submittedAt: string;
    files: DriverDocumentFile[];
}

export interface VehicleImage {
    s3Key: string;
    status: string;
}

export interface DriverVehicle {
    _id: string;
    vehicleType: string;
    name: string;
    vehicleModel: string;
    year: number;
    color: string;
    numberPlate: string;
    images: VehicleImage[];
}

// ---------------------------------------------------------------------
// OVERVIEW SELECTION — everything visible on first paint (header card,
// stat blocks, basic info). Deliberately does NOT select `documents`
// or `vehicle` — those are pulled by the selections below, fired lazily.
// ---------------------------------------------------------------------
export interface GetDriverOverviewData {
    getDriver: {
        id: string;
        userId: string;
        gender: string;
        fullName: string;
        profileImage?: string;
        rating: number;
        email: string;
        address: string;
        suspended: boolean;
        phone: string;
        dateOfBirth: string | null;
        citizenshipNumber: string | null;
        joinedDate: string;
        totalRidesAsDriver: number;
        totalEarnings: number;
        amountDueToCompany: number;
        lastTripAt: string | null;
        lastTripStartTime: string | null;
        lastTripEndTime: string | null;
        lastTripDuration: number | null;
        emergencyContact: string | null;
        status: 'ACTIVE' | 'PENDING' | 'BLOCKED';
    };
}

export interface GetDriverVars {
    driverId: string;
}

export const GET_DRIVER_OVERVIEW: TypedDocumentNode<GetDriverOverviewData, GetDriverVars> = gql`
    query GetDriverOverview($driverId: String!) {
        getDriver(driverId: $driverId) {
            id
            userId
            fullName
            profileImage
            rating
            email
            address
            suspended
            phone
            dateOfBirth
            joinedDate
            gender
            totalRidesAsDriver
            totalEarnings
            amountDueToCompany
            lastTripAt
            lastTripStartTime
            lastTripEndTime
            lastTripDuration
            status
            citizenshipNumber
        }
    }
`;

// ---------------------------------------------------------------------
// DOCUMENTS SELECTION — fired lazily when the Documents tab opens.
// Still calls getDriver under the hood (same resolver), just asks for
// a different slice of fields.
// ---------------------------------------------------------------------
export interface GetDriverDocumentsData {
    getDriver: {
        id: string;
        documents: DriverDocument[];
    };
}

export const GET_DRIVER_DOCUMENTS: TypedDocumentNode<GetDriverDocumentsData, GetDriverVars> = gql`
    query GetDriverDocuments($driverId: String!) {
        getDriver(driverId: $driverId) {
            id
            documents {
                _id
                type
                status
                rejectionReason
                reviewedBy
                reviewedAt
                submittedAt
                files {
                    side
                    s3Key
                    isActive
                    status
                    verifiedBy
                    verifiedAt
                    downloadUrl
                    createdAt
                    _id
                }
            }
        }
    }
`;

export const GET_DRIVER_RIDE_HISTORY = gql`
    query GetDriverRideHistory($driverId: ID!, $page: Int!, $limit: Int!) {
        driverTrips(driverId: $driverId, page: $page, limit: $limit) {
            totalCount
            hasNextPage
            rides {
                id
                riderName
                pickupAddress
                dropAddress
                fare
                status
                startedAt
                endedAt
            }
        }
    }
`;
// ---------------------------------------------------------------------
// VEHICLE SELECTION — small, but kept separate from overview so it's
// easy to promote into the eager query later, or keep lazy, without
// touching the documents selection.
// ---------------------------------------------------------------------
export interface GetDriverVehicleData {
    getDriver: {
        id: string;
        vehicle: DriverVehicle | null;
    };
}

export const GET_DRIVER_VEHICLE: TypedDocumentNode<GetDriverVehicleData, GetDriverVars> = gql`
    query GetDriverVehicle($driverId: ID!) {
        getDriver(driverId: $driverId) {
            id
            vehicle {
                _id
                vehicleType
                name
                vehicleModel
                year
                color
                numberPlate
                images {
                    s3Key
                    status
                }
            }
        }
    }
`;

export interface GetDriverDocumentsData {
    getDriverDocuments: DriverDocument[];
}
export interface GetDriverDocumentsVars {
    driverId: string;
}
