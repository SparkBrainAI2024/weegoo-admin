import { useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import OtpInput from 'react18-input-otp';
import { ThemeMode } from 'types/config';
import { Box } from '@mui/material';

const AuthCodeVerification = () => {
    const theme = useTheme();
    const [otp, setOtp] = useState<string>();
    const [timer, setTimer] = useState(5);
    const [canResend, setCanResend] = useState(false);
    const borderColor = theme.palette.mode === ThemeMode.DARK ? theme.palette.grey[200] : theme.palette.grey[300];

    useEffect(() => {
        if (timer === 0) {
            setCanResend(true);
            return;
        }
        const interval = setInterval(() => {
            setTimer((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [timer]);

    const handleResend = () => {
        setTimer(28);
        setCanResend(false);
        // call your resend API here
    };

    const formatTime = (seconds: number) => {
        const m = String(Math.floor(seconds / 60)).padStart(2, '0');
        const s = String(seconds % 60).padStart(2, '0');
        return `${m}:${s}`;
    };

    return (
        <Stack direction="column" alignItems="center" spacing={2} width="100%">
            <Stack spacing={4} width="100%">
                <OtpInput
                    value={otp}
                    onChange={(otpNumber: string) => setOtp(otpNumber)}
                    numInputs={5}
                    containerStyle={{
                        justifyContent: 'space-between',
                        width: '100%',
                        gap: '12px'
                    }}
                    inputStyle={{
                        height: '54px',
                        fontWeight: 400,
                        width: '100%',
                        border: `2px solid ${borderColor}`,
                        borderRadius: 4,
                    }}
                    focusStyle={{
                        outline: 'none',
                        border: `2px solid ${theme.palette.primary.main}`
                    }}
                />

                <Button disableElevation fullWidth size="large" type="submit" variant="contained" style={{ height: '46px', color: '#2A2A2A' }}>
                    Verify
                </Button>
            </Stack>

            <Box style={{ fontSize: '16px', fontWeight: 400, lineHeight: '24px', color: '#5B6570' }}>
                Did not receive the code?
            </Box>

            {canResend ? (
                <Box
                    onClick={handleResend}
                    style={{ fontSize: '14px', fontWeight: 600, lineHeight: '21px', color: theme.palette.primary.main, cursor: 'pointer' }}
                >
                    Resend code
                </Box>
            ) : (
                <Box style={{ fontSize: '14px', fontWeight: 400, lineHeight: '21px', color: '#5B6570' }}>
                    Resend code in {formatTime(timer)}
                </Box>
            )}
        </Stack>
    );
};

export default AuthCodeVerification;