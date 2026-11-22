import { ApolloClient, InMemoryCache, HttpLink, ApolloLink, Observable } from '@apollo/client';
import { ROUTES } from 'constants/routes';
import LocalStorageService from 'services/localStorage.service';
import axios from 'utils/axios';

let isRefreshing = false;
let pendingRequests: Array<(token: string | null) => void> = [];

const onRefreshed = (token: string | null) => {
    pendingRequests.forEach((callback) => callback(token));
    pendingRequests = [];
};

export const refreshAdminToken = async (): Promise<string | null> => {
    const refreshToken = LocalStorageService.get('refreshToken');
    if (!refreshToken) {
        return null;
    }

    try {
        const response = await fetch(import.meta.env.VITE_GRAPHQL_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                lang: 'EN'
            },
            body: JSON.stringify({
                query: `
                    mutation adminRefreshToken($input: AdminRefreshTokenInput!) {
                        adminRefreshToken(input: $input) {
                            accessToken
                            refreshToken
                        }
                    }
                `,
                variables: {
                    input: { refreshToken }
                }
            })
        });

        const resJson = await response.json();
        const data = resJson.data?.adminRefreshToken;

        if (!data?.accessToken) {
            throw new Error(resJson.errors?.[0]?.message || 'Failed to refresh token');
        }

        LocalStorageService.set('serviceToken', data.accessToken);
        if (data.refreshToken) {
            LocalStorageService.set('refreshToken', data.refreshToken);
        }
        axios.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`;

        return data.accessToken;
    } catch (error) {
        console.error('Error refreshing token:', error);
        LocalStorageService.remove('serviceToken');
        LocalStorageService.remove('refreshToken');
        delete axios.defaults.headers.common.Authorization;
        return null;
    }
};

const authLink = new ApolloLink((operation, forward) => {
    const token = LocalStorageService.get('serviceToken');
    operation.setContext(({ headers = {} }) => ({
        headers: {
            ...headers,
            Authorization: token ? `Bearer ${token}` : '',
            lang: 'EN'
        }
    }));
    return forward(operation);
});

const errorLink = new ApolloLink((operation, forward) => {
    return new Observable((observer) => {
        let sub: any;

        const execute = () => {
            sub = forward(operation).subscribe({
                next: (response) => {
                    const errors = response?.errors;
                    const hasUnauthorized = errors?.some((err) => {
                        const statusCode = (err.extensions as any)?.statusCode;
                        const message = err.message;
                        return statusCode === 401 || message === 'COMMON.UNAUTHORIZED' || message === 'COMMON.INVALID_TOKEN';
                    });

                    if (hasUnauthorized) {
                        if (window.location.pathname === ROUTES.LOGIN) {
                            observer.next(response);
                            return;
                        }

                        if (isRefreshing) {
                            pendingRequests.push((newToken) => {
                                if (newToken) {
                                    operation.setContext(({ headers = {} }: any) => ({
                                        headers: {
                                            ...headers,
                                            Authorization: `Bearer ${newToken}`
                                        }
                                    }));
                                    forward(operation).subscribe(observer);
                                } else {
                                    if (window.location.pathname !== ROUTES.LOGIN) {
                                        window.location.href = ROUTES.LOGIN;
                                    }
                                    observer.next(response);
                                }
                            });
                            return;
                        }

                        isRefreshing = true;

                        refreshAdminToken()
                            .then((newToken) => {
                                if (newToken) {
                                    onRefreshed(newToken);
                                    operation.setContext(({ headers = {} }: any) => ({
                                        headers: {
                                            ...headers,
                                            Authorization: `Bearer ${newToken}`
                                        }
                                    }));
                                    forward(operation).subscribe(observer);
                                } else {
                                    onRefreshed(null);
                                    if (window.location.pathname !== ROUTES.LOGIN) {
                                        window.location.href = ROUTES.LOGIN;
                                    }
                                    observer.next(response);
                                }
                            })
                            .catch((err) => {
                                onRefreshed(null);
                                if (window.location.pathname !== ROUTES.LOGIN) {
                                    window.location.href = ROUTES.LOGIN;
                                }
                                observer.error(err);
                            })
                            .finally(() => {
                                isRefreshing = false;
                            });

                        return;
                    }

                    observer.next(response);
                },
                error: (error) => {
                    observer.error(error);
                },
                complete: () => {
                    observer.complete();
                }
            });
        };

        execute();

        return () => {
            if (sub) {
                sub.unsubscribe();
            }
        };
    });
});

const client = new ApolloClient({
    link: ApolloLink.from([errorLink, authLink, new HttpLink({ uri: import.meta.env.VITE_GRAPHQL_URL })]),
    cache: new InMemoryCache()
});

export default client;
