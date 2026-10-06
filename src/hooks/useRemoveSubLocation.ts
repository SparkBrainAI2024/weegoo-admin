import { useMutation } from '@apollo/client/react';
import { REMOVE_SUB_LOCATION } from 'graphql/mutations/location.mutation';

export function useRemoveSubLocation() {
    // response is the parent location with its new subLocations: Apollo updates the cache, no refetch
    const [mutate] = useMutation(REMOVE_SUB_LOCATION);

    return {
        removeSubLocation: (locationId: string, subLocationId: string) => mutate({ variables: { locationId, subLocationId } })
    };
}
