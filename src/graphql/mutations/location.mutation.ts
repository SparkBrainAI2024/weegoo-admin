import { gql, TypedDocumentNode } from '@apollo/client';
import { LocationStatus } from 'graphql/queries/locations.queries';

export interface LocationInput {
    name: string;
    status: LocationStatus;
}

export interface LocationSummary {
    _id: string;
    createdAt: string;
    updatedAt: string;
    name: string;
    status: LocationStatus;
}

export const CREATE_LOCATION: TypedDocumentNode<{ createLocation: LocationSummary }, { input: LocationInput }> = gql`
    mutation CreateLocation($input: CreateLocationInput!) {
        createLocation(input: $input) {
            _id
            createdAt
            updatedAt
            name
            status
        }
    }
`;

export const UPDATE_LOCATION: TypedDocumentNode<{ updateLocation: LocationSummary }, { updateLocationId: string; input: LocationInput }> =
    gql`
        mutation UpdateLocation($updateLocationId: ID!, $input: UpdateLocationMasterInput!) {
            updateLocation(id: $updateLocationId, input: $input) {
                _id
                createdAt
                updatedAt
                name
                status
            }
        }
    `;
