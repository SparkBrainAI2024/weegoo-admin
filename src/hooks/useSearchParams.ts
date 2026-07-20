// hooks/useUrlParams.ts
import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

type ParamValue = string | number | boolean | undefined;
type ParamUpdates = Record<string, ParamValue>;

/**
 * Reusable URL-search-params state for filter/pagination-style pages.
 * Values default to omitted from the URL (i.e. "clean" URL == default state),
 * and updates are merged, never clobbering unrelated params.
 */
export const useUrlParams = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const getParam = useCallback(
        <T = string>(key: string, defaultValue: T, parser?: (raw: string) => T): T => {
            const raw = searchParams.get(key);
            if (raw === null) return defaultValue;
            return parser ? parser(raw) : (raw as unknown as T);
        },
        [searchParams]
    );

    /**
     * Merge `updates` into the current params. Any value that is `undefined`
     * or `''` is deleted rather than written (keeps defaults out of the URL).
     * Pass `resetKeys` for params that should be cleared as a side effect
     * (e.g. resetting `page` whenever a filter changes).
     */
    const updateParams = useCallback(
        (updates: ParamUpdates, options?: { resetKeys?: string[] }) => {
            setSearchParams(
                (prev) => {
                    const next = new URLSearchParams(prev);
                    Object.entries(updates).forEach(([key, value]) => {
                        if (value === undefined || value === '') {
                            next.delete(key);
                        } else {
                            next.set(key, String(value));
                        }
                    });
                    options?.resetKeys?.forEach((key) => next.delete(key));
                    return next;
                },
                { replace: true }
            );
        },
        [setSearchParams]
    );

    return { getParam, updateParams };
};
