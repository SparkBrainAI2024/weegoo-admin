import { updateCompanyInfo } from 'graphql/mutations/settings.mutation';
import { CompanyInfo, getCompanyInfo } from 'graphql/queries/settings.queries';
import { useEffect, useState, useCallback } from 'react';

export function useCompanyInfo() {
    const [data, setData] = useState<CompanyInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        getCompanyInfo().then((res) => {
            setData(res);
            setLoading(false);
        });
    }, []);

    const save = useCallback(async (input: CompanyInfo) => {
        setSaving(true);
        const res = await updateCompanyInfo(input);
        setData(res);
        setSaving(false);
        return res;
    }, []);

    return { data, loading, saving, save };
}
