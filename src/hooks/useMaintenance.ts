import { updateMaintenanceStatus } from 'graphql/mutations/settings.mutation';
import { getMaintenanceStatus, MaintenanceStatus } from 'graphql/queries/settings.queries';
import { useEffect, useState, useCallback } from 'react';

export function useMaintenanceStatus() {
    const [data, setData] = useState<MaintenanceStatus | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        getMaintenanceStatus().then((res) => {
            setData(res);
            setLoading(false);
        });
    }, []);

    const save = useCallback(async (input: MaintenanceStatus) => {
        setSaving(true);
        const res = await updateMaintenanceStatus(input);
        setData(res);
        setSaving(false);
        return res;
    }, []);

    return { data, loading, saving, save };
}
