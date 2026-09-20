import { useMutation, useQuery } from '@apollo/client/react';
import { UPSERT_MAINTENANCE_INFO, UpsertMaintenanceInfoInput } from 'graphql/mutations/settings.mutation';
import { GET_MAINTENANCE_INFO } from 'graphql/queries/settings.queries';

export function useMaintenanceStatus() {
    const { data, loading } = useQuery(GET_MAINTENANCE_INFO, { fetchPolicy: 'network-only' });
    const [upsertMaintenanceInfo, { loading: saving }] = useMutation(UPSERT_MAINTENANCE_INFO);

    const save = async (input: UpsertMaintenanceInfoInput) => {
        const { data: res } = await upsertMaintenanceInfo({
            variables: { input },
            refetchQueries: [{ query: GET_MAINTENANCE_INFO }]
        });
        return res?.upsertMaintenanceInfo;
    };

    return { data: data?.maintenanceInfo, loading, saving, save };
}
