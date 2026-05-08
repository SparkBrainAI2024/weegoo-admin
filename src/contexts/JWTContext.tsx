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
import { InitialLoginContextProps, JWTContextType, SignUpResponse } from 'types/auth';
import client from 'lib/apolloClient';
import { Gender } from 'types/enum';
import { SIGN_UP } from 'graphql/mutations/auth.mutations';

const chance = new Chance();

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
    console.log('token:', serviceToken);
    if (serviceToken && verifyToken(serviceToken)) {
        dispatch({ type: LOGIN, payload: { isLoggedIn: true, user: null } });
    } else {
        console.log('dispatching LOGOUT');
        dispatch({ type: LOGOUT });
    }
};

        init();
    }, []);

    const login = async (email: string, password: string) => {
        const response = await axios.post('/api/account/login', { email, password });
        const { serviceToken, user } = response.data;
        setSession(serviceToken);
        dispatch({
            type: LOGIN,
            payload: {
                isLoggedIn: true,
                user
            }
        });
    };
const register = async (
    email: string,
    fullName: string,
    phone: string,
    gender: Gender
): Promise<SignUpResponse> => {
    const { data } = await client.mutate<{ signUp: SignUpResponse }>({
        mutation: SIGN_UP,
        variables: {
            input: { email, fullName, phone, gender },
        },
    });

    if (!data?.signUp) {
        throw new Error('Signup failed');
    }

    if (data.signUp.userToken) {
        setSession(data.signUp.userToken);
    }

    return data.signUp;
};

    const logout = () => {
        setSession(null);
        dispatch({ type: LOGOUT });
    };

    const resetPassword = async (email: string) => {};

    const updateProfile = () => {};

    if (state.isInitialized !== undefined && !state.isInitialized) {
        return <>Loading</>;
    }

    return (
        <JWTContext.Provider value={{ ...state, login, logout, register, resetPassword, updateProfile }}>{children}</JWTContext.Provider>
    );
};

export default JWTContext;
