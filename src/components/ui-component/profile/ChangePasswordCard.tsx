import { Button, Grid, Paper, Stack, TextField, Typography } from '@mui/material';
import { useMutation } from '@apollo/client/react';
import { useFormik } from 'formik';
import useNotification from 'hooks/useNotification';
import { CHANGE_ADMIN_PASSWORD } from 'graphql/mutations/admin-profile.mutations';
import LabeledField from './LabeledField';

type Field = 'currentPassword' | 'newPassword' | 'confirmPassword';

export default function ChangePasswordCard() {
    const { showSuccess, showError } = useNotification();
    const [changePassword] = useMutation(CHANGE_ADMIN_PASSWORD);

    const formik = useFormik({
        initialValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
        validate: (v) => {
            const errors: Partial<Record<Field, string>> = {};
            if (!v.currentPassword) errors.currentPassword = 'Enter your current password';
            if (v.newPassword.length < 10) errors.newPassword = 'Password must be at least 10 characters';
            else if (v.newPassword.length > 72) errors.newPassword = 'Password must be at most 72 characters';
            else if (v.newPassword === v.currentPassword) errors.newPassword = 'New password must be different';
            if (v.confirmPassword !== v.newPassword) errors.confirmPassword = 'Passwords do not match';
            return errors;
        },
        onSubmit: async (v, { resetForm }) => {
            try {
                const res = await changePassword({
                    variables: { input: { currentPassword: v.currentPassword, newPassword: v.newPassword } }
                });
                showSuccess(res.data?.changeAdminPassword.message ?? 'Password updated successfully');
                resetForm();
            } catch (err) {
                console.error(err);
                showError(err instanceof Error ? err.message : 'Failed to update password');
            }
        }
    });

    const field = (name: Field, label: string, autoComplete: string) => (
        <Grid item xs={12} md={4}>
            <LabeledField label={label} htmlFor={name}>
                <TextField
                    id={name}
                    name={name}
                    type="password"
                    size="small"
                    fullWidth
                    autoComplete={autoComplete}
                    value={formik.values[name]}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched[name] && !!formik.errors[name]}
                    helperText={formik.touched[name] && formik.errors[name]}
                />
            </LabeledField>
        </Grid>
    );

    return (
        <Paper elevation={1} sx={{ p: 3, borderRadius: 3 }}>
            <form onSubmit={formik.handleSubmit} noValidate>
                <Stack gap={3}>
                    <Stack gap={0.5}>
                        <Typography variant="h5">Change Password</Typography>
                        <Typography variant="body2" color="text.secondary">
                            For security, use a strong password
                        </Typography>
                    </Stack>

                    <Grid container spacing={2}>
                        {field('currentPassword', 'Current Password', 'current-password')}
                        {field('newPassword', 'New Password', 'new-password')}
                        {field('confirmPassword', 'Confirm New Password', 'new-password')}
                    </Grid>

                    <Stack direction="row" alignItems="center" gap={2}>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={formik.isSubmitting}
                            sx={{ bgcolor: 'grey.900', color: 'common.white', '&:hover': { bgcolor: 'grey.800' } }}
                        >
                            Update Password
                        </Button>
                        <Typography variant="caption" color="text.secondary">
                            Password must be at least 10 characters.
                        </Typography>
                    </Stack>
                </Stack>
            </form>
        </Paper>
    );
}
