import { useEffect, useState } from 'react';
import { PlaceSuggestion, searchBaato } from '../api/baato';

export function useBaatoSearch(query: string) {
    const [results, setResults] = useState<PlaceSuggestion[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        const q = query.trim();
        if (q.length < 2) {
            setResults([]);
            setError(false);
            return;
        }
        // abort the previous request so a slow old response can't overwrite a newer one
        const controller = new AbortController();
        setLoading(true);
        setError(false);
        searchBaato(q, controller.signal)
            .then(setResults)
            .catch((e) => {
                if (e.name !== 'AbortError') {
                    setResults([]);
                    setError(true);
                }
            })
            .finally(() => {
                if (!controller.signal.aborted) setLoading(false);
            });
        return () => controller.abort();
    }, [query]);

    return { results, loading, error };
}
