// graphql/driver.queries.ts
import { gql } from '@apollo/client';

export const GET_DRIVERS = gql`
    query GetDrivers($input: DriverListInput) {
        getDrivers(input: $input) {
            data {
                id
                fullName
                phone
                profileImage
                status
                totalRides
                totalEarnings
                rating
                joinedDate
            }
            pagination {
                total
                page
                limit
                hasNextPage
                hasPreviousPage
            }
        }
    }
`;
