import { Link } from 'react-router-dom';

// material-ui
import { Theme } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

// project imports
import AuthWrapper1 from '../AuthWrapper1';
import AuthCardWrapper from '../AuthCardWrapper';
import Logo from 'components/ui-component/Logo';
import AuthForgotPassword from '../auth-forms/AuthForgotPassword';
import AuthFooter from 'components/ui-component/cards/AuthFooter';
import useAuth from 'hooks/useAuth';
import { Box, Stack } from '@mui/material';
import { PAGE_TOKEN } from 'constants/pages';

// ============================|| AUTH3 - FORGOT PASSWORD ||============================ //

const ForgotPassword = () => {
    const downMD = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
    const { isLoggedIn } = useAuth();

    return (
        <AuthWrapper1>
            <Grid container direction="column" justifyContent="center" alignItems="center" sx={{ minHeight: '100vh' }}>
                <Grid item sx={{ mx: { xs: 2, sm: 0 } }}>
                    <AuthCardWrapper page={PAGE_TOKEN.FORGOT_PASSWORD}>
                        <Stack
                            direction="column"
                            spacing="24px"
                            width="100%"
                            height='334px'
                        >

                            <Box>
                                <Box sx={{ fontSize: '24px', lineHeight: '32px', fontWeight: 600, color: '#2A2A2A' }}>
                                    Forgot password?
                                </Box>
                                <Box sx={{ fontSize: '16px', lineHeight: '24px', color: '#4B5565' }}>
                                    Enter your credentials to continue
                                </Box>
                            </Box>
                            <Box>
                                Enter your email address below and we'll send you password reset OTP.
                            </Box>

                            <Box>
                                <AuthForgotPassword />
                            </Box>

                        </Stack>
                    </AuthCardWrapper>

                </Grid>

            </Grid>
        </AuthWrapper1>
    );
};

export default ForgotPassword;
