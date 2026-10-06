// useCreateLocation.ts
import { useMutation } from '@apollo/client/react';
import { CREATE_LOCATION, LocationInput } from 'graphql/mutations/location.mutation';
import { GET_LOCATIONS } from 'graphql/queries/locations.queries';

export function useCreateLocation() {
    // a brand-new row isn't in the cached list, so refetch it
    const [mutate, { loading }] = useMutation(CREATE_LOCATION, { refetchQueries: [GET_LOCATIONS] });

    const createLocation = async (input: LocationInput) => {
        const res = await mutate({ variables: { input } });
        return res.data?.createLocation;
    };
    return { createLocation, loading };
}
