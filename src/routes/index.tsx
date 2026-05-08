import { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

// routes
import MainRoutes from './MainRoutes';
import LoginRoutes from './LoginRoutes';
import AuthenticationRoutes from './AuthenticationRoutes';

// project import
import Loadable from 'components/ui-component/Loadable';
import useAuth from 'hooks/useAuth';


const RootRedirect = () => {
    const { isLoggedIn, isInitialized } = useAuth();
    if (!isInitialized) return null;
    return isLoggedIn 
        ? <Navigate to="/" replace /> 
        : <Navigate to="/login" replace />;
};

const router = createBrowserRouter([
    { path: '/', element: <RootRedirect /> },
    LoginRoutes,
    MainRoutes,
    AuthenticationRoutes
], { basename: import.meta.env.VITE_APP_BASE_NAME });
export default router;
