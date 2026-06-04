import { useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// third-party
import OtpInput from 'react18-input-otp';

// types
import { ThemeMode } from 'types/config';
import { Box } from '@mui/material';

// ============================|| STATIC - CODE VERIFICATION ||============================ //

const AuthCodeVerification = () => {
    const theme = useTheme();
    const [otp, setOtp] = useState<string>();
    const borderColor = theme.palette.mode === ThemeMode.DARK ? theme.palette.grey[200] : theme.palette.grey[300];

    return (
        <Stack direction="column" alignItems="center" spacing={2} width="100%">
        <Stack spacing={4}>
                <OtpInput
                value={otp}
                onChange={(otpNumber: string) => setOtp(otpNumber)}
                numInputs={5}
                containerStyle={{
                    justifyContent: 'space-between',
                    width: '100%',        // ← fill parent width
                    gap: '12px'           // ← gap between inputs instead of margin
                }}
                inputStyle={{
                    height: '54px',
                    fontWeight: 400,
                    width: '100%',
                    // padding: '10px',
                    border: `2px solid ${borderColor}`,
                    borderRadius: 4,
                    ':hover': {
                        borderColor: theme.palette.primary.main
                    }
                }}
                focusStyle={{
                    outline: 'none',
                    border: `2px solid ${theme.palette.primary.main}`
                }}
            />
     

                <Button disableElevation fullWidth size="large" type="submit" variant="contained" style={{ height: "46px", color:"#2A2A2A" }}>
                    Verify
                </Button>
        </Stack>
                <Box style={{ fontSize: "16px", fontWeight: 400, lineHeight: "24px",color: '#5B6570' }}>
                    Did not receive the code?

                </Box>
                <Box style={{ fontSize: "14px", fontWeight: 400, lineHeight: "21px",color:"#5B6570" }}>
                    Resend code in 00:28
                </Box>

            

        </Stack>
    );
};
export default AuthCodeVerification;
