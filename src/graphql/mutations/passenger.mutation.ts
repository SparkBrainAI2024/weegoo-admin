import { gql } from '@apollo/client';

export const DELETE_PASSENGER = gql`
    mutation DeletePassenger($input: DeletePassengerInput!) {
        deletePassenger(input: $input)
    }
`;

export const BLOCK_PASSENGER = gql`
    mutation BlockPassenger($id: ID!) {
        blockPassenger(id: $id) {
            id
            suspended
        }
    }
`;

export const UNBLOCK_PASSENGER = gql`
    mutation UnblockPassenger($id: ID!) {
        unblockPassenger(id: $id) {
            id
            suspended
        }
    }
`;
