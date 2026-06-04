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
    const downMD = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

    return (
        <AuthWrapper1>
            <Grid container direction="column" sx={{ minHeight: '100vh' }} justifyContent="center" alignItems="center" >
                <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
                    <AuthCardWrapper page={PAGE_TOKEN.RESET_PASSWORD}>
                        <Stack direction="column" spacing="10px" >
                        <Box >
                         
                                <Box>
                                    <Box sx={{ fontSize: '24px', lineHeight: '32px', fontWeight: 600, color: '#2A2A2A' }}>
                                        Update password
                                    </Box>
                                    <Box sx={{ fontSize: '16px', lineHeight: '24px', color: '#4B5565' }}>
                                        Please enter your new password below                                 </Box>
                                </Box>
                            
                        </Box>
                                <Divider/>  
                        <Box >
                            <AuthResetPassword />
                        </Box>
                        </Stack>
                    </AuthCardWrapper>
                </Grid>
            </Grid>

        </AuthWrapper1>
    );
};

export default ResetPassword;
