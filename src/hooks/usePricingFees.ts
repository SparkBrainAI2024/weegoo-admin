import { updatePricingFees } from 'graphql/mutations/settings.mutation';
import { getPricingFees, VehiclePricing } from 'graphql/queries/settings.queries';
import { useEffect, useState, useCallback } from 'react';

export function usePricingFees() {
    const [configs, setConfigs] = useState<VehiclePricing[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        getPricingFees().then((res) => {
            setConfigs(res);
            setLoading(false);
        });
    }, []);

    const save = useCallback(async (input: VehiclePricing) => {
        setSaving(true);
        const res = await updatePricingFees(input);
        setConfigs((prev) => prev.map((c) => (c.vehicleType === res.vehicleType ? res : c)));
        setSaving(false);
        return res;
    }, []);

    return { configs, loading, saving, save };
}
