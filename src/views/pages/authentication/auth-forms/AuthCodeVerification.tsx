import { useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import OtpInput from 'react18-input-otp';
import { ThemeMode } from 'types/config';
import { Box } from '@mui/material';
import { AUTH } from 'constants/auth';
import { useMutation } from '@apollo/client/react';
import { VERIFY_OTP } from 'graphql/mutations/auth.mutations';
import { VerifyOtpResponse } from 'types/auth';
import { useLocation, useNavigate } from 'react-router';

const AuthCodeVerification = ({ email }: { email: string }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [otp, setOtp] = useState<string>();
    const [timer, setTimer] = useState(AUTH.RESEND_CODE_TIME);
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
        setTimer(AUTH.RESEND_CODE_TIME);
        setCanResend(false);
        // call your resend API here
    };
    const [verifyOtp, { loading }] = useMutation<VerifyOtpResponse>(VERIFY_OTP);

    const handleVerify = async () => {
        try {
            const { data } = await verifyOtp({
                variables: {
                    input: {
                        email,
                        otp: Number(otp)  // Float in schema so convert from string
                    }
                }
            });

            if (data?.adminVerifyOtp?.success) {
                navigate('/reset-password', {
                    state: { resetPasswordToken: data.adminVerifyOtp.resetPasswordToken }
                });
            }
        } catch (err: any) {
            console.error(err);
        }
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
                        fontSize: '34px',
                        fontWeight: 400,
                        lineHeight: '51px',
                        width: '100%',
                        border: `2px solid ${borderColor}`,
                        borderRadius: 4,
                    }}
                    focusStyle={{
                        outline: 'none',
                        border: `2px solid ${theme.palette.primary.main}`
                    }}
                />

                <Button
                    disableElevation
                    fullWidth
                    size="large"
                    variant="contained"
                    disabled={!otp || otp.length < 5 || loading}
                    onClick={handleVerify}
                    style={{ height: '46px', color: '#2A2A2A' }}
                >
                    {loading ? 'Verifying...' : 'Verify'}
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