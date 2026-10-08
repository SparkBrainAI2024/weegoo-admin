import { useMutation } from '@apollo/client/react';
import { CREATE_SUB_LOCATION, SubLocationInput, UPDATE_SUB_LOCATION } from 'graphql/mutations/location.mutation';

export function useCreateSubLocation() {
    const [mutate] = useMutation(CREATE_SUB_LOCATION);
    return (locationId: string, input: SubLocationInput) => mutate({ variables: { locationId, input } });
}

export function useUpdateSubLocation() {
    const [mutate] = useMutation(UPDATE_SUB_LOCATION);
    return (locationId: string, subLocationId: string, input: Omit<SubLocationInput, 'status'>) =>
        mutate({ variables: { locationId, subLocationId, input } });
}
