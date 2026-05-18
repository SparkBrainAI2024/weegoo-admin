import { useNavigate } from 'react-router-dom';

// project imports
import useAuth from 'hooks/useAuth';
import { GuardProps } from 'types';
import { useEffect } from 'react';

// ==============================|| AUTH GUARD ||============================== //

/**
 * Authentication guard for routes
 * @param {PropTypes.node} children children element/node
 */
const AuthGuard = ({ children }: GuardProps) => {
    const { isLoggedIn, isInitialized } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isInitialized && !isLoggedIn) {
            navigate('login', { replace: true });
        }
    }, [isLoggedIn, isInitialized, navigate]);

    if (!isInitialized) return null; // wait

    return children;
};

export default AuthGuard;
