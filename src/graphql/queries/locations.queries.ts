import { gql, TypedDocumentNode } from '@apollo/client';

export type LocationStatus = 'ACTIVE' | 'INACTIVE';

export interface SubLocation {
    _id: string;
    address: string;
    latitude: number;
    longitude: number;
    status: LocationStatus;
}

export interface LocationDetail {
    _id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string | null;
    deleted: boolean;
    name: string;
    latitude: number;
    longitude: number;
    status: LocationStatus;
    subLocations: SubLocation[];
}

export interface GetLocationData {
    location: LocationDetail;
}
export interface GetLocationVars {
    locationId: string;
}

export const GET_LOCATION: TypedDocumentNode<GetLocationData, GetLocationVars> = gql`
    query Location($locationId: ID!) {
        location(id: $locationId) {
            _id
            createdAt
            updatedAt
            deletedAt
            deleted
            name
            latitude
            longitude
            status
            subLocations {
                _id
                address
                latitude
                longitude
                status
            }
        }
    }
`;

export interface GetLocationSubLocationsData {
    locationSubLocations: SubLocation[];
}
export interface GetLocationSubLocationsVars {
    locationId: string;
    status?: LocationStatus | null;
}

export const GET_LOCATION_SUB_LOCATIONS: TypedDocumentNode<GetLocationSubLocationsData, GetLocationSubLocationsVars> = gql`
    query LocationSubLocations($locationId: ID!, $status: LocationStatus) {
        locationSubLocations(locationId: $locationId, status: $status) {
            _id
            address
            latitude
            longitude
            status
        }
    }
`;

export interface LocationsPagination {
    page: number;
    limit: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nextPage?: number | null;
    previousPage?: number | null;
    total: number;
}

export interface GetLocationsData {
    locations: {
        message: string;
        data: LocationDetail[];
        pagination: LocationsPagination;
    };
}

export interface GetLocationsVars {
    paginationInput: { page: number; limit: number };
    status?: LocationStatus | null;
}

export const GET_LOCATIONS: TypedDocumentNode<GetLocationsData, GetLocationsVars> = gql`
    query Locations($paginationInput: PaginationInput!, $status: LocationStatus) {
        locations(paginationInput: $paginationInput, status: $status) {
            message
            data {
                _id
                createdAt
                updatedAt
                deletedAt
                deleted
                name
                latitude
                longitude
                status
                subLocations {
                    _id
                    address
                    latitude
                    longitude
                    status
                }
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
