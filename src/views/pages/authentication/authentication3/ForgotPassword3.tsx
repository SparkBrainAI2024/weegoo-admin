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
import AuthForgotPassword from '../auth-forms/AuthForgotPassword';
import {  Stack } from '@mui/material';
import { PAGE_TOKEN } from 'constants/pages';

// ============================|| AUTH3 - FORGOT PASSWORD ||============================ //

const ForgotPassword = () => {
    return (
        <AuthWrapper1>
            <AuthCardWrapper page={PAGE_TOKEN.FORGOT_PASSWORD}>
                <Stack spacing={3}>
                    <Stack spacing={0.5}>
                        <Typography variant="h3">Forgot Password?</Typography>
                        <Typography variant="body1" color="text.secondary">Enter your credentials to continue</Typography>
                    </Stack>
                    <Typography variant="body1" color="text.secondary">
                        Enter your email address below and we'll send you a password reset OTP.
                    </Typography>
                    <AuthForgotPassword />
                </Stack>
            </AuthCardWrapper>
        </AuthWrapper1>
    );
};

export default ForgotPassword;
