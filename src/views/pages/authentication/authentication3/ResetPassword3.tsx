import { Link } from 'react-router-dom';

// material-ui
import { Theme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

// project imports
import AuthWrapper1 from '../AuthWrapper1';
import AuthCardWrapper from '../AuthCardWrapper';
import Logo from 'components/ui-component/Logo';
import AuthResetPassword from '../auth-forms/AuthResetPassword';
import AuthFooter from 'components/ui-component/cards/AuthFooter';
import { Box, Divider } from '@mui/material';
import { PAGE_TOKEN } from 'constants/pages';

// assets

// ============================|| AUTH3 - RESET PASSWORD ||============================ //

const ResetPassword = () => {
    return (
        <AuthWrapper1>
            <AuthCardWrapper page={PAGE_TOKEN.RESET_PASSWORD}>
                <Stack spacing={3}>
                    <Stack spacing={0.5}>
                        <Typography variant="h3">Update password</Typography>
                        <Typography variant="body1" color="text.secondary">
                            Please enter your new password below
                        </Typography>
                    </Stack>
                    <Divider />
                    <AuthResetPassword />
                </Stack>
            </AuthCardWrapper>
        </AuthWrapper1>
    );
};

export default ResetPassword;
