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
import { Box } from '@mui/material';

// ============================|| AUTH3 - FORGOT PASSWORD ||============================ //

const ForgotPassword = () => {
    const downMD = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
    const { isLoggedIn } = useAuth();

    return (
        <AuthWrapper1>
            <Grid container direction="column" justifyContent="flex-end" sx={{ minHeight: '100vh' }}>
                <Grid item xs={12}>
                    <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: 'calc(100vh - 68px)' }}>
                        <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
                            <AuthCardWrapper>
                                <Grid container spacing={2} alignItems="center" justifyContent="center">

                                    <Grid item xs={12}>
                                        <Grid container alignItems="center" justifyContent="center" textAlign="left" spacing={2}>
                                            <Grid item xs={12}>
                                                <Box>
                                                    <Typography color="text.primary" gutterBottom={false} variant={downMD ? 'h3' : 'h2'}>
                                                        Forgot password?
                                                    </Typography>
                                                    <Typography
                                                        color="text.secondary"
                                                        variant={downMD ? 'subtitle1' : 'h5'}
                                                        sx={{ mt: 0.5, fontWeight: 400 }}
                                                    >
                                                        Enter your credentials to continue
                                                    </Typography>
                                                </Box>
                                            </Grid>

                                          
                                            <Grid item xs={12}>
                                                <Typography variant="caption" fontSize="16px" textAlign="center">
                                                    Enter your email address below and we&apos;ll send you password reset OTP.
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <AuthForgotPassword />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Divider />
                                    </Grid>
                                   
                                </Grid>
                            </AuthCardWrapper>
                        </Grid>
                    </Grid>
                </Grid>
              
            </Grid>
        </AuthWrapper1>
    );
};

export default ForgotPassword;
