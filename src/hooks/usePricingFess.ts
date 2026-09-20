import { useMutation, useQuery } from '@apollo/client/react';
import { BULK_UPSERT_PRICING } from 'graphql/mutations/settings.mutation';
import { GET_ALL_PRICING, GetAllPricingResult, VehiclePricing } from 'graphql/queries/settings.queries';

function stripTypename(row: VehiclePricing) {
    const { vehicleType, commission, baseFare, amountPerKm, amountPerMinute, isEnabled } = row;
    return { vehicleType, commission, baseFare, amountPerKm, amountPerMinute, isEnabled };
}

export function usePricingFees() {
    const { data, loading } = useQuery<GetAllPricingResult, Record<string, never>>(GET_ALL_PRICING, {
        fetchPolicy: 'network-only'
    });
    const [bulkUpsert, { loading: saving }] = useMutation(BULK_UPSERT_PRICING);

    const initialValues = data?.adminRidePricings ? { pricingList: data.adminRidePricings } : null;

    const save = async (values: { pricingList: VehiclePricing[] }) => {
        const { data: res } = await bulkUpsert({
            variables: { input: { pricingList: values.pricingList.map(stripTypename) } },
            refetchQueries: [{ query: GET_ALL_PRICING }]
        });
        return res?.upsertAdminRidePricings;
    };

    return { initialValues, loading, saving, save };
}
