import { useMemo } from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_LOCATIONS } from 'graphql/queries/locations.queries';

export function useLocations(search: string) {
    const { data, loading, error } = useQuery(GET_LOCATIONS, {
        variables: { paginationInput: { page: 0, limit: 10 } }
    });

    const locations = useMemo(() => {
        const all = data?.locations.data ?? [];
        const q = search.trim().toLowerCase();
        if (!q) return all;
        return all.filter((l) => l.name.toLowerCase().includes(q) || l.subLocations.some((s) => s.address.toLowerCase().includes(q)));
    }, [data, search]);

    return { locations, total: data?.locations.pagination.total ?? 0, loading, error };
}
