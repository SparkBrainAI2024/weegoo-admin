import { useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import AnimateButton from 'components/ui-component/extended/AnimateButton';
import useAuth from 'hooks/useAuth';
import useScriptRef from 'hooks/useScriptRef';

import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { FORGOT_PASSWORD } from 'graphql/mutations/auth.mutations';
import { useMutation } from '@apollo/client/react';
import { ForgotPasswordResponse } from 'types/auth.response';
import { InputField } from 'components/ui-component/forms/InputField';
import { ROUTES } from 'constants/routes';
import { useState } from 'react';
import NotificationBanner from 'components/ui-component/snackbar/AppSnackBar';
import { SeverityEnum } from 'types/enum';
import useNotification from 'hooks/useNotification';
import { extractApiLevelError } from 'lib/apiError';

// ========================|| FIREBASE - FORGOT PASSWORD ||======================== //

const AuthForgotPassword = ({ ...others }) => {
    const { notification, showSuccess, showError, clearNotification } = useNotification();


    const navigate = useNavigate();
    const [forgotPassword] = useMutation<ForgotPasswordResponse>(FORGOT_PASSWORD);

    return (
        <Formik
            initialValues={{ email: '', submit: null }}
            validationSchema={Yup.object().shape({
                email: Yup.string().email('Must be a valid email').max(255).required('Email is required')
            })}
            onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                try {
                    const { data } = await forgotPassword({
                        variables: { input: { email: values.email } }
                    });
                    if (data?.adminForgotPassword?.success) {
                        setStatus({ success: true });
                        setSubmitting(false);
                        showSuccess(data.adminForgotPassword.message || 'Check mail for reset password link');

                        setTimeout(() => navigate(ROUTES.VERIFY_OTP, { state: { email: values.email }, replace: true }), 1500);

                    } else {
                        setStatus({ success: false });
                        setErrors({ submit: data?.adminForgotPassword?.message || 'Something went wrong' });
                        setSubmitting(false);


                    }
                } catch (err: any) {


                    setSubmitting(false);


                    showError(extractApiLevelError(err));

                }
            }}
        >
            {({ errors, handleSubmit, isSubmitting }) => (
                <>
                    <NotificationBanner
                        open={Boolean(notification.message)}
                        message={notification.message}
                        onClose={clearNotification}
                        severity={notification.severity}
                    />
                    <form noValidate onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }} {...others}>

                        <InputField name="email" label="Email Address" type="email" />


                        <AnimateButton>
                            <Button disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                                Send
                            </Button>
                        </AnimateButton>

                    </form></>
            )}
        </Formik>
    );
};

export default AuthForgotPassword;
