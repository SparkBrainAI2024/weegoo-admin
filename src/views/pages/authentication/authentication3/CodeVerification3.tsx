import { Link } from 'react-router-dom';

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
    const downMD = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

    return (
        <AuthWrapper1>
            <Grid container direction="column" justifyContent="center" alignItems="center" sx={{ minHeight: '100vh' }}>
                <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
                    <AuthCardWrapper page={PAGE_TOKEN.VERIFY_OTP}>
                        <Grid container spacing={2} alignItems="center" justifyContent="center">

                            <Grid item>
                                <Stack direction="column" spacing={4}>
                                    <Box>
                                        <Box sx={{ fontSize: '24px', lineHeight: '36px', fontWeight: 600, color: '#2A2A2A' }}>
                                            OTP Verification
                                        </Box>

                                        <Box sx={{ fontSize: '16px', lineHeight: '24px', color: '#5B6570' }}>
                                            Enter the 6-digit code we sent to your email
                                        </Box>
                                    </Box>
                                   <AuthCodeVerification />

                                </Stack>

                            </Grid>



                        </Grid>
                    </AuthCardWrapper>
                </Grid>
            </Grid>
        </AuthWrapper1>
    );
};

export default CodeVerification;
