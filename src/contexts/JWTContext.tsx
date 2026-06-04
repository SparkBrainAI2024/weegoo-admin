import React, { createContext, useEffect, useReducer } from 'react';

// third-party
import { Chance } from 'chance';
import { jwtDecode } from 'jwt-decode';

// reducer - state management
import { LOGIN, LOGOUT } from 'store/actions';
import accountReducer from 'store/accountReducer';

// project imports
import Loader from 'components/ui-component/Loader';
import axios from 'utils/axios';

// types
import { KeyedObject } from 'types';
import { InitialLoginContextProps, JWTContextType, SignInResponse, SignUpResponse } from 'types/auth';
import client from 'lib/apolloClient';
import { SIGN_IN } from 'graphql/mutations/auth.mutations';


// constant
const initialState: InitialLoginContextProps = {
    isLoggedIn: false,
    isInitialized: false,
    user: null
};

const verifyToken: (st: string) => boolean = (serviceToken) => {
    if (!serviceToken) {
        return false;
    }
    const decoded: KeyedObject = jwtDecode(serviceToken);
    /**
     * Property 'exp' does not exist on type '<T = unknown>(token: string, options?: JwtDecodeOptions | undefined) => T'.
     */
    return decoded.exp > Date.now() / 1000;
};

const setSession = (serviceToken?: string | null) => {
    if (serviceToken) {
        localStorage.setItem('serviceToken', serviceToken);
        axios.defaults.headers.common.Authorization = `Bearer ${serviceToken}`;
    } else {
        localStorage.removeItem('serviceToken');
        delete axios.defaults.headers.common.Authorization;
    }
};

// ==============================|| JWT CONTEXT & PROVIDER ||============================== //
const JWTContext = createContext<JWTContextType | null>(null);

export const JWTProvider = ({ children }: { children: React.ReactElement }) => {
    const [state, dispatch] = useReducer(accountReducer, initialState);

    useEffect(() => {
        const init = async () => {
            const serviceToken = window.localStorage.getItem('serviceToken');
            if (serviceToken && verifyToken(serviceToken)) {
                dispatch({ type: LOGIN, payload: { isLoggedIn: true, user: null } });
            } else {
                dispatch({ type: LOGOUT });
            }
        };

        init();
    }, []);

    const login = async (email: string, password: string) => {

        const { data } = await client.mutate<{ adminSignIn: SignInResponse }>({
            mutation: SIGN_IN,
            variables: {
                input: { email, password },
            },
            errorPolicy: 'none', // this makes Apollo throw on GraphQL errors
        });
        if (!data?.adminSignIn) {
            throw new Error('SignIn failed');
        }

        if (data.adminSignIn.accessToken) {
            setSession(data.adminSignIn.accessToken);
        }

        const { accessToken, admin } = data.adminSignIn;
        setSession(accessToken);
        dispatch({
            type: LOGIN,
            payload: {
                isLoggedIn: true,
                user: admin
            }
        });
    };


    const logout = () => {
        setSession(null);
        dispatch({ type: LOGOUT });
    };

    const resetPassword = async (email: string) => { };

    const updateProfile = () => { };

    if (state.isInitialized !== undefined && !state.isInitialized) {
        return <>Loading</>;
    }

    return (
        <JWTContext.Provider value={{ ...state, login, logout, resetPassword, updateProfile }}>{children}</JWTContext.Provider>
    );
};

export default JWTContext;
