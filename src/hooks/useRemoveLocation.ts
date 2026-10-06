// hooks/useRemoveLocation.ts
import { useMutation } from '@apollo/client/react';
import { REMOVE_LOCATION } from 'graphql/mutations/location.mutation';
import { GET_LOCATIONS } from 'graphql/queries/locations.queries';

export function useRemoveLocation() {
    // returns no object, so Apollo can't update the list itself: refetch it,
    // and wait, so the list is fresh before the caller navigates away
    const [mutate] = useMutation(REMOVE_LOCATION, { refetchQueries: [GET_LOCATIONS], awaitRefetchQueries: true });

    return { removeLocation: (id: string) => mutate({ variables: { removeLocationId: id } }) };
}
