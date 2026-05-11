import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import MinimalLayout from 'components/layout/MinimalLayout';
import NavMotion from 'components/layout/NavMotion';
import Loadable from 'components/ui-component/Loadable';
import useAuth from 'hooks/useAuth';
import CodeVerification from 'views/pages/authentication/authentication3/CodeVerification3';

const AuthLogin = Loadable(lazy(() => import('views/pages/authentication/authentication3/Login3')));
const AuthRegister = Loadable(lazy(() => import('views/pages/authentication/authentication3/Register3')));
const AuthForgotPassword = Loadable(lazy(() => import('views/pages/authentication/authentication3/ForgotPassword3')));
const AuthResetPassword = Loadable(lazy(() => import('views/pages/authentication/authentication3/ResetPassword3')));
const AuthCheckMail = Loadable(lazy(() => import('views/pages/authentication/authentication3/CheckMail3')));

const GuestGuard = ({ children }: { children: React.ReactElement }) => {
    const { isLoggedIn, isInitialized } = useAuth();
    if (!isInitialized) return null;
    if (isLoggedIn) return <Navigate to="/" replace />;
    return children;
};

const LoginRoutes = {
    path: '/',
    element: <NavMotion><MinimalLayout /></NavMotion>,
    children: [
        { path: '/login', element: <GuestGuard><AuthLogin /></GuestGuard> },
        { path: '/register', element: <AuthRegister /> },
        { path: '/forgot', element: <AuthForgotPassword /> },
        {path:'/verify-otp', element: <CodeVerification />},
        { path: '/reset-password', element: <AuthResetPassword /> },
        { path: '/check-mail', element: <AuthCheckMail /> }
    ]
};

export default LoginRoutes;