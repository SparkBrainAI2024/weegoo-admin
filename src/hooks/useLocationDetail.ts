// useLocationDetail.ts
import { useQuery } from '@apollo/client/react';
import { GET_LOCATION } from 'graphql/queries/locations.queries';

export function useLocationDetail(locationId: string | null) {
    const { data, loading, error } = useQuery(GET_LOCATION, {
        variables: { locationId: locationId ?? '' },
        skip: !locationId
    });
    return { location: data?.location, loading, error };
}
