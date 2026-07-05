import { gql } from '@apollo/client';

export const DELETE_DRIVER = gql`
    mutation DeleteDriver($input: DeleteDriverInput!) {
        deleteDriver(input: $input)
    }
`;
