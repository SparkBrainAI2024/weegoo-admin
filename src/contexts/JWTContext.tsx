import React, { createContext, useEffect, useReducer } from 'react';

// third-party
import { jwtDecode } from 'jwt-decode';

// reducer - state management
import { LOGIN, LOGOUT } from 'store/actions';
import accountReducer from 'store/accountReducer';

// project imports
import axios from 'utils/axios';

// types
import { KeyedObject } from 'types';
import { InitialLoginContextProps, JWTContextType, SignInResponse } from 'types/auth.response';
import client, { refreshAdminToken } from 'lib/apolloClient';
import { SIGN_IN, ADMIN_LOGOUT } from 'graphql/mutations/auth.mutations';

// constant
const initialState: InitialLoginContextProps = {
    isLoggedIn: false,
    isInitialized: false,
    user: null
};

const verifyToken: (st: string) => { verified: boolean; id?: string } = (serviceToken) => {
    if (!serviceToken) {
        return { verified: false };
    }
    const decoded: KeyedObject = jwtDecode(serviceToken);
    /**
     * Property 'exp' does not exist on type '<T = unknown>(token: string, options?: JwtDecodeOptions | undefined) => T'.
     */

    return { verified: decoded.exp > Date.now() / 1000, id: decoded.id };
};

const setSession = (serviceToken?: string | null, refreshToken?: string | null) => {
    if (serviceToken) {
        localStorage.setItem('serviceToken', serviceToken);
        axios.defaults.headers.common.Authorization = `Bearer ${serviceToken}`;
    } else {
        localStorage.removeItem('serviceToken');
        delete axios.defaults.headers.common.Authorization;
    }

    if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
    } else if (serviceToken === null || refreshToken === null) {
        localStorage.removeItem('refreshToken');
    }
};

// ==============================|| JWT CONTEXT & PROVIDER ||============================== //
const JWTContext = createContext<JWTContextType | null>(null);

export const JWTProvider = ({ children }: { children: React.ReactElement }) => {
    const [state, dispatch] = useReducer(accountReducer, initialState);

    useEffect(() => {
        const init = async () => {
            const serviceToken = window.localStorage.getItem('serviceToken');
            const refreshToken = window.localStorage.getItem('refreshToken');

            if (serviceToken && verifyToken(serviceToken).verified) {
                dispatch({ type: LOGIN, payload: { isLoggedIn: true, user: { id: verifyToken(serviceToken).id } } });
            } else if (refreshToken) {
                // Access token expired/missing, but refreshToken exists: attempt refresh
                const newAccessToken = await refreshAdminToken();
                if (newAccessToken && verifyToken(newAccessToken).verified) {
                    dispatch({ type: LOGIN, payload: { isLoggedIn: true, user: { id: verifyToken(newAccessToken).id } } });
                } else {
                    setSession(null, null);
                    dispatch({ type: LOGOUT });
                }
            } else {
                setSession(null, null);
                dispatch({ type: LOGOUT });
            }
        };

        init();
    }, []);

    const login = async (email: string, password: string) => {
        const { data } = await client.mutate<{ adminSignIn: SignInResponse }>({
            mutation: SIGN_IN,
            variables: {
                input: { email, password }
            },
            errorPolicy: 'none' // this makes Apollo throw on GraphQL errors
        });
        if (!data?.adminSignIn) {
            throw new Error('SignIn failed');
        }

        const { accessToken, refreshToken, admin } = data.adminSignIn;

        setSession(accessToken, refreshToken);
        dispatch({
            type: LOGIN,
            payload: {
                isLoggedIn: true,
                user: { ...admin, id: admin._id }
            }
        });
    };

    const logout = async () => {
        try {
            await client.mutate({
                mutation: ADMIN_LOGOUT
            });
        } catch (e) {
            console.error('Logout error:', e);
        } finally {
            setSession(null, null);
            dispatch({ type: LOGOUT });
        }
    };

    const resetPassword = async (email: string) => {};

    const updateProfile = () => {};

    if (state.isInitialized !== undefined && !state.isInitialized) {
        return <>Loading</>;
    }

    return <JWTContext.Provider value={{ ...state, login, logout, resetPassword, updateProfile }}>{children}</JWTContext.Provider>;
};

export default JWTContext;
