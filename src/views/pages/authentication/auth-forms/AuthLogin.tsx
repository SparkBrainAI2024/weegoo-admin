import { Button, Checkbox, FormControlLabel, FormHelperText, Grid, Stack, Typography } from "@mui/material";
import AnimateButton from "components/ui-component/extended/AnimateButton";
import { InputField } from "components/ui-component/forms/InputField";
import { PasswordField } from "components/ui-component/forms/PasswordField";
import NotificationBanner from "components/ui-component/snackbar/AppSnackBar";
import { Formik } from "formik";
import useAuth from "hooks/useAuth";
import useScriptRef from "hooks/useScriptRef";
import { handleErrors } from "lib/apiError";
import { showErrorToast } from "lib/utils/toast";
import { useState } from "react";
import { Link } from "react-router-dom";
import * as Yup from "yup";

const JWTLogin = ({ loginProp }: { loginProp?: number }) => {
    const { login } = useAuth();
    const scriptedRef = useScriptRef();
    const [checked, setChecked] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    return (
        <Formik
            initialValues={{ email: '', password: '', submit: null }}
            validationSchema={Yup.object().shape({
                email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                password: Yup.string().max(255).required('Password is required')
            })}
            onSubmit={async (values, { setStatus, setSubmitting, setErrors }) => {
                try {
                    await login(values.email, values.password);
                    if (scriptedRef.current) {
                        setStatus({ success: true });
                        setSubmitting(false);
                    }
                } catch (err: any) {
                    if (scriptedRef.current) {
                        setStatus({ success: false });
                        setSubmitting(false);
                    }

                    handleErrors(err, setErrors);

                    const message =
                        err?.response?.data?.message ||
                        err?.message ||
                        '';

                    setErrorMessage(message);
                }
            }}
        >
            {({ errors, handleSubmit, isSubmitting }) => (<>
                <NotificationBanner
                    open={Boolean(errorMessage)}
                    message={errorMessage}
                    onClose={() => setErrorMessage('')}
                />

                <form noValidate onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>

                    <InputField name="email" label="Email Address" type="email" />
                    <PasswordField name="password" label="Password" />

                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <FormControlLabel
                            control={<Checkbox checked={checked} onChange={(e) => setChecked(e.target.checked)} color="primary" />}
                            label="Remember me"
                        />
                        <Typography variant="subtitle1" component={Link} to={loginProp ? `/pages/forgot-password/forgot-password${loginProp}` : '/forgot'} color="#43A048" sx={{ textDecoration: 'none' }}>
                            Forgot Password?
                        </Typography>
                    </Stack>

                    <AnimateButton>
                        <Button color="primary" disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained">
                            Sign In
                        </Button>
                    </AnimateButton>

                </form>
            </>
            )}
        </Formik>
    );
};
export default JWTLogin;