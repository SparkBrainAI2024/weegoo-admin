import { Link, useLocation } from 'react-router-dom';

// material-ui
import { Theme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

// project imports
import AuthWrapper1 from '../AuthWrapper1';
import AuthCardWrapper from '../AuthCardWrapper';
import Logo from 'components/ui-component/Logo';
import AnimateButton from 'components/ui-component/extended/AnimateButton';
import AuthCodeVerification from '../auth-forms/AuthCodeVerification';
import AuthFooter from 'components/ui-component/cards/AuthFooter';
import { PAGE_TOKEN } from 'constants/pages';
import { Box } from '@mui/material';

// ===========================|| AUTH3 - CODE VERIFICATION ||=========================== //

const CodeVerification = () => {
    const location = useLocation();
    const email = (location.state as { email: string })?.email;

    return (
        <AuthWrapper1>
            <AuthCardWrapper page={PAGE_TOKEN.VERIFY_OTP}>
                <Stack spacing={3}>
                    <Stack spacing={0.5}>
                        <Typography variant="h3">OTP Verification</Typography>
                        <Typography variant="body1" color="text.secondary">
                            Enter the 5-digit code we sent to your email
                        </Typography>
                    </Stack>
                    <AuthCodeVerification email={email} />
                </Stack>
            </AuthCardWrapper>
        </AuthWrapper1>
    );
};

export default CodeVerification;
