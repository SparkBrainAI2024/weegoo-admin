import { Link, Navigate } from 'react-router-dom';

// material-ui
import { Theme } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

// project imports
import AuthWrapper1 from '../AuthWrapper1';
import AuthCardWrapper from '../AuthCardWrapper';
import AuthLogin from '../auth-forms/AuthLogin';
import Logo from 'components/ui-component/Logo';
import AuthFooter from 'components/ui-component/cards/AuthFooter';
import useAuth from 'hooks/useAuth';
import { Box } from '@mui/material';

// assets

// ================================|| AUTH3 - LOGIN ||================================ //

const Login = () => {
    const { isLoggedIn } = useAuth();
    const downMD = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
if (isLoggedIn) return <Navigate to="/dashboard/default" replace />;
    return (
        <AuthWrapper1>
            <Grid container direction="column" justifyContent="flex-end" sx={{ minHeight: '100vh' }}>
                <Grid item xs={12}>
                    <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: 'calc(100vh - 68px)' }}>
                        <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
                            <AuthCardWrapper>
                               <Stack
                                direction="column"
                                spacing="20px"
                                width="100%"
                               >
                                    <Box>
        <Box sx={{ fontSize: '24px', lineHeight: '32px', fontWeight: 600, color: '#2A2A2A' }}>
            Hi, Welcome Back
        </Box>
        <Box sx={{ fontSize: '16px', lineHeight: '24px', color: '#4B5565' }}>
            Login to your account
        </Box>
    </Box>
  <AuthLogin />

                               </Stack>
                            </AuthCardWrapper>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sx={{ m: 3, mt: 1 }}>
                    <AuthFooter />
                </Grid>
            </Grid>
        </AuthWrapper1>
    );
};

export default Login;
