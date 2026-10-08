// useCreateLocation.ts
import { useMutation } from '@apollo/client/react';
import { CREATE_LOCATION, LocationInput } from 'graphql/mutations/location.mutation';

export function useCreateLocation() {
    // a brand-new row isn't in the cached list, so refetch it
    const [mutate, { loading }] = useMutation(CREATE_LOCATION, {
        update(cache) {
            // a new location means any cached `locations` list is stale: drop it,
            // so the list page fetches fresh data the next time it mounts
            cache.evict({ fieldName: 'locations' });
        }
    });

    const createLocation = async (input: LocationInput) => {
        const res = await mutate({ variables: { input } });
        return res.data?.createLocation;
    };
    return { createLocation, loading };
}
