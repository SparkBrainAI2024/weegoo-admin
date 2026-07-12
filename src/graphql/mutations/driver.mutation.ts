import { gql } from '@apollo/client';

export const DELETE_DRIVER = gql`
    mutation DeleteDriver($input: DeleteDriverInput!) {
        deleteDriver(input: $input)
    }
`;

export const BLOCK_DRIVER = gql`
    mutation BlockDriver($id: ID!) {
        blockDriver(id: $id) {
            id
            suspended
        }
    }
`;

export const UNBLOCK_DRIVER = gql`
    mutation UnblockDriver($id: ID!) {
        unblockDriver(id: $id) {
            id
            suspended
        }
    }
`;
