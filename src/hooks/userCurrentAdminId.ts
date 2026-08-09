// hooks/useCurrentAdminId.ts
//
// STOPGAP — there's no admin-auth context in the app yet (same gap noted on the
// backend resolver). Centralizing the lookup here means fixing auth later is a
// one-file change: swap the body for whatever your real auth context/JWT decode
// ends up being, every call site (BulkResolve, resolve-from-row, etc.) stays the same.

import useAuth from './useAuth';

export function useCurrentAdminId(): string {
    const { user } = useAuth();
    console.log(user?.id ?? '', 'userid adminid');

    // TODO: replace with real admin id from auth context once it exists
    return user?.id ?? '';
}
