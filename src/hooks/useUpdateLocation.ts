// useUpdateLocation.ts
import { useMutation } from '@apollo/client/react';
import { LocationInput, UPDATE_LOCATION } from 'graphql/mutations/location.mutation';

export function useUpdateLocation() {
    // no refetch: the response carries _id, so Apollo merges name/status into the cached entity
    const [mutate, { loading }] = useMutation(UPDATE_LOCATION);

    const updateLocation = async (locationId: string, input: LocationInput) => {
        const res = await mutate({ variables: { updateLocationId: locationId, input } });
        return res.data?.updateLocation;
    };
    return { updateLocation, loading };
}
