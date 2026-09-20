import { useMutation, useQuery } from '@apollo/client/react';
import { UPSERT_COMPANY_INFO, UpsertCompanyInfoInput } from 'graphql/mutations/settings.mutation';
import { GET_COMPANY_INFO } from 'graphql/queries/settings.queries';

export function useCompanyInfo() {
    const { data, loading } = useQuery(GET_COMPANY_INFO, { fetchPolicy: 'network-only' });
    const [upsertCompanyInfo, { loading: saving }] = useMutation(UPSERT_COMPANY_INFO);

    const save = async (input: UpsertCompanyInfoInput) => {
        const { data: res } = await upsertCompanyInfo({
            variables: { input },
            refetchQueries: [{ query: GET_COMPANY_INFO }]
        });
        return res?.upsertAdminCompanyInfo;
    };

    return { data: data?.adminCompanyInfo, loading, saving, save };
}
