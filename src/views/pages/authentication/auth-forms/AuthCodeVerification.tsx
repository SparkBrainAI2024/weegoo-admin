import { useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import OtpInput from 'react18-input-otp';
import { ThemeMode } from 'types/config';
import { Box, FormHelperText, Typography } from '@mui/material';
import { AUTH } from 'constants/auth';
import { useMutation } from '@apollo/client/react';
import { VERIFY_OTP } from 'graphql/mutations/auth.mutations';
import { VerifyOtpResponse } from 'types/auth';
import { useLocation, useNavigate } from 'react-router';
import { ROUTES } from 'constants/routes';

const AuthCodeVerification = ({ email }: { email: string }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [otp, setOtp] = useState<string>();
    const [timer, setTimer] = useState(AUTH.RESEND_CODE_TIME);
    const [canResend, setCanResend] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (timer === 0) { setCanResend(true); return; }
        const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
        return () => clearInterval(interval);
    }, [timer]);

    const handleResend = () => { setTimer(AUTH.RESEND_CODE_TIME); setCanResend(false); };

    const [verifyOtp, { loading }] = useMutation<VerifyOtpResponse>(VERIFY_OTP);

    const handleVerify = async () => {
        try {
            const { data } = await verifyOtp({ variables: { input: { email, otp: Number(otp) } } });
            if (data?.adminVerifyOtp?.success) {
                navigate(ROUTES.RESET_PASSWORD, { state: { resetPasswordToken: data.adminVerifyOtp.resetPasswordToken } });
            }
        } catch (err: any) {
            console.log(err);
            
setError(err?.errors?.[0]?.message || err.message);      }
    };

    const formatTime = (seconds: number) => {
        const m = String(Math.floor(seconds / 60)).padStart(2, '0');
        const s = String(seconds % 60).padStart(2, '0');
        return `${m}:${s}`;
    };

    return (
        <Stack spacing={2} alignItems="center" width="100%">
            <Stack spacing={4} width="100%">
                <OtpInput
                    value={otp}
                    onChange={(otpNumber: string) => setOtp(otpNumber)}
                    numInputs={5}
                    containerStyle={{ justifyContent: 'space-between', width: '100%', gap: '12px' }}
                    inputStyle={{
                        height: '54px', fontSize: '34px', fontWeight: 400,
                        lineHeight: '51px', width: '100%',
                        border: `2px solid ${theme.palette.grey[300]}`,
                        borderRadius: 4,
                    }}
                    focusStyle={{ outline: 'none', border: `2px solid ${theme.palette.primary.main}` }}
                />
                {error && <FormHelperText error sx={{ textAlign: 'center' }}>{error}</FormHelperText>}

                <Button disableElevation fullWidth size="large" variant="contained" disabled={!otp || otp.length < 5 || loading} onClick={handleVerify}>
                    {loading ? 'Verifying...' : 'Verify'}
                </Button>
            </Stack>

            <Typography variant="body1" color="text.secondary">Did not receive the code?</Typography>

            {canResend ? (
                <Typography variant="body2" fontWeight={600} color="primary" sx={{ cursor: 'pointer' }} onClick={handleResend}>
                    Resend code
                </Typography>
            ) : (
                <Typography variant="body2" color="text.secondary">
                    Resend code in {formatTime(timer)}
                </Typography>
            )}
        </Stack>
    );
};

export default AuthCodeVerification;