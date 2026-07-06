import { gql } from '@apollo/client';

export const DELETE_DRIVER = gql`
    mutation DeleteDriver($input: DeleteDriverInput!) {
        deleteDriver(input: $input)
    }
`;

export const TOGGLE_BLOCK_DRIVER = gql`
    mutation ToggleBlockDriver($input: ToggleBlockDriverInput!) {
        toggleBlockDriver(input: $input) {
            suspended
            success
            message
        }
    }
`;
