import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Typography from '@mui/material/Typography';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import useAuth from 'hooks/useAuth';
import useScriptRef from 'hooks/useScriptRef';
import AnimateButton from 'components/ui-component/extended/AnimateButton';
import { strengthColor, strengthIndicator } from 'utils/password-strength';

import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// types
import { StringColorProps } from 'types';
import { ResetPasswordResponse } from 'types/auth.response';
import { useMutation } from '@apollo/client/react';
import { RESET_PASSWORD } from 'graphql/mutations/auth.mutations';
import { PasswordField } from 'components/ui-component/forms/PasswordField';
import { Stack } from '@mui/material';
import { ROUTES } from 'constants/routes';
import NotificationBanner from 'components/ui-component/snackbar/AppSnackBar';
import useNotification from 'hooks/useNotification';
import { extractApiLevelError } from 'lib/apiError';

// ========================|| FIREBASE - RESET PASSWORD ||======================== //

const AuthResetPassword = ({ resetPasswordToken }: { resetPasswordToken: string }) => {
    const navigate = useNavigate();
    const scriptedRef = useScriptRef();
    const [resetPassword] = useMutation<ResetPasswordResponse>(RESET_PASSWORD);
    const [strength, setStrength] = useState(0);
    const [level, setLevel] = useState<StringColorProps>();
    const { notification, showSuccess, showError, clearNotification } = useNotification();

    const changePassword = (value: string) => {
        const temp = strengthIndicator(value);
        setStrength(temp);
        setLevel(strengthColor(temp));
    };

    useEffect(() => { changePassword(''); }, []);

    return (
        <Formik
            initialValues={{ password: '', confirmPassword: '', submit: null }}
            validationSchema={Yup.object().shape({
                password: Yup.string().max(255).required('Password is required').min(8, 'Password must be at least 8 characters'),
                confirmPassword: Yup.string()
                    .required('Confirm Password is required')
                    .test('confirmPassword', 'Both Password must be match!', (confirmPassword, yup) => yup.parent.password === confirmPassword)
            })}
            onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                try {
                    const { data } = await resetPassword({
                        variables: { input: { newPassword: values.password, resetPasswordToken } }
                    });
                    if (data?.adminResetPassword?.success) {

                        setStatus({ success: true });
                        setSubmitting(false);
                        showSuccess(data.adminResetPassword.message || 'Check mail for reset password link');
                        setTimeout(() => navigate(ROUTES.LOGIN, { replace: true }), 1500);
                    } else {
                        setStatus({ success: false });
                        setSubmitting(false);
                    }
                } catch (err: any) {
                    if (scriptedRef.current) {

                        setSubmitting(false);
                        showError(extractApiLevelError(err));

                    }
                }
            }}
        >
            {({ errors, handleSubmit, isSubmitting, values, handleChange, handleBlur, touched }) => (
                <> <NotificationBanner
                    open={Boolean(notification.message)}
                    message={notification.message}
                    onClose={clearNotification}
                    severity={notification.severity}
                />   <form noValidate onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>

                        <PasswordField name="password" label="New Password" onChange={(e) => { handleChange(e); changePassword(e.target.value); }} />

                        {strength !== 0 && (
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Box sx={{ width: 85, height: 8, borderRadius: '7px', bgcolor: level?.color }} />
                                <Typography variant="subtitle1" fontSize="0.75rem">{level?.label}</Typography>
                            </Stack>
                        )}

                        <PasswordField name="confirmPassword" label="Confirm Password" />

                        <Typography variant="caption" color="text.secondary">Must be at least 8 characters</Typography>


                        <AnimateButton>
                            <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                                Reset Password
                            </Button>
                        </AnimateButton>

                    </form></>
            )}
        </Formik>
    );
};

export default AuthResetPassword;
