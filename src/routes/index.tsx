import { createBrowserRouter, Navigate } from 'react-router-dom';

// routes
import MainRoutes from './MainRoutes';
import LoginRoutes from './LoginRoutes';
import AuthenticationRoutes from './AuthenticationRoutes';
// project import
import useAuth from 'hooks/useAuth';

const RootRedirect = () => {
    const { isLoggedIn, isInitialized } = useAuth();
    if (!isInitialized) return null;
    return isLoggedIn ? <Navigate to="/dashboard/default" replace /> : <Navigate to="/login" replace />;
};

const router = createBrowserRouter([{ path: '/', element: <RootRedirect /> }, LoginRoutes, MainRoutes, AuthenticationRoutes], {
    basename: import.meta.env.VITE_APP_BASE_NAME
});
export default router;
