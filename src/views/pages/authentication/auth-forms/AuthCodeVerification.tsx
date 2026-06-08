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
import { FORGOT_PASSWORD, VERIFY_OTP } from 'graphql/mutations/auth.mutations';
import { ForgotPasswordResponse, VerifyOtpResponse } from 'types/auth';
import { useLocation, useNavigate } from 'react-router';
import { ROUTES } from 'constants/routes';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';

const AuthCodeVerification = ({ email }: { email: string }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [otp, setOtp] = useState<string>();
    const [timer, setTimer] = useState(AUTH.RESEND_CODE_TIME);
    const [canResend, setCanResend] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const dispatch = useDispatch();


    const [forgotPassword] = useMutation<ForgotPasswordResponse>(FORGOT_PASSWORD);
    const [verifyOtp, { loading }] = useMutation<VerifyOtpResponse>(VERIFY_OTP);

    useEffect(() => {
        if (timer === 0) { setCanResend(true); return; }
        const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
        return () => clearInterval(interval);
    }, [timer]);

    const handleResend = async () => {
        setTimer(AUTH.RESEND_CODE_TIME);
        setCanResend(false);
        try {
            const { data } = await forgotPassword({ variables: { input: { email } } });
            dispatch(openSnackbar({ open: true, message: data?.adminForgotPassword?.message || 'Check mail for reset password link', variant: 'alert', alert: { color: 'success' }, close: false }));

            if (!data?.adminForgotPassword?.success) {
                setError(data?.adminForgotPassword?.message || 'Something went wrong');
            }
        } catch (err: any) {
            setError(err?.errors?.[0]?.message || err.message);
        }
    };

    const handleVerify = async () => {
        try {
            const { data } = await verifyOtp({ variables: { input: { email, otp: Number(otp) } } });
            if (data?.adminVerifyOtp?.success) {
                dispatch(openSnackbar({ open: true, message: data?.adminVerifyOtp?.message, variant: 'alert', alert: { color: 'success' }, close: false }));

                setTimeout(() => {
                    navigate(ROUTES.RESET_PASSWORD, { state: { resetPasswordToken: data.adminVerifyOtp.resetPasswordToken } });
                }, 1500);
            } else {
                setError(data?.adminVerifyOtp?.message || 'Something went wrong');
            }
        } catch (err: any) {
            setError(err?.graphQLErrors?.[0]?.message || err.message);
        }
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