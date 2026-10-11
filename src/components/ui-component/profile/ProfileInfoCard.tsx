import { Button, Grid, InputAdornment, Paper, Stack, TextField, Typography } from '@mui/material';
import { useMutation } from '@apollo/client/react';
import { useFormik } from 'formik';
import useNotification from 'hooks/useNotification';
import { UPDATE_ADMIN_PROFILE } from 'graphql/mutations/admin-profile.mutations';
import { AdminProfile } from 'graphql/queries/admin-profile.queries';
import LabeledField from './LabeledField';

interface Props {
    profile: AdminProfile;
}

export default function ProfileInfoCard({ profile }: Props) {
    const { showSuccess, showError } = useNotification();
    const [updateProfile] = useMutation(UPDATE_ADMIN_PROFILE);

    const formik = useFormik({
        // after a save the cache updates, the profile prop changes, and the form re-baselines (dirty = false)
        enableReinitialize: true,
        initialValues: { fullName: profile.fullName, phone: profile.phone ?? '' },
        validate: (v) => {
            const errors: { fullName?: string; phone?: string } = {};
            const name = v.fullName.trim();
            if (name.length < 3) errors.fullName = 'Full name must be at least 3 characters';
            else if (name.length > 30) errors.fullName = 'Full name must be at most 30 characters';
            if (v.phone && !/^\d{10}$/.test(v.phone)) errors.phone = 'Enter a 10-digit phone number';
            return errors;
        },
        onSubmit: async (v) => {
            try {
                await updateProfile({ variables: { input: { fullName: v.fullName.trim(), phone: v.phone || null } } });
                showSuccess('Profile updated successfully');
            } catch (err) {
                console.error(err);
                showError('Failed to update profile');
            }
        }
    });

    const error = (name: 'fullName' | 'phone') => formik.touched[name] && formik.errors[name];

    return (
        <Paper elevation={1} sx={{ p: 3, borderRadius: 3 }}>
            <form onSubmit={formik.handleSubmit} noValidate>
                <Stack gap={3}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={2}>
                        <Stack gap={0.5}>
                            <Typography variant="h5">Profile Information</Typography>
                            <Typography variant="body2" color="text.secondary">
                                Update your personal details
                            </Typography>
                        </Stack>
                        <Button type="submit" variant="contained" disabled={!formik.dirty || formik.isSubmitting}>
                            Save
                        </Button>
                    </Stack>

                    <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                            <LabeledField label="Full Name" htmlFor="fullName">
                                <TextField
                                    id="fullName"
                                    name="fullName"
                                    size="small"
                                    fullWidth
                                    value={formik.values.fullName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={!!error('fullName')}
                                    helperText={error('fullName')}
                                />
                            </LabeledField>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <LabeledField label="Phone" htmlFor="phone">
                                <TextField
                                    id="phone"
                                    name="phone"
                                    size="small"
                                    fullWidth
                                    value={formik.values.phone}
                                    onChange={(e) => formik.setFieldValue('phone', e.target.value.replace(/\D/g, ''))}
                                    onBlur={formik.handleBlur}
                                    error={!!error('phone')}
                                    helperText={error('phone')}
                                    inputProps={{ inputMode: 'numeric', maxLength: 10 }}
                                    InputProps={{ startAdornment: <InputAdornment position="start">+977</InputAdornment> }}
                                />
                            </LabeledField>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <LabeledField label="Email (read-only)" htmlFor="email">
                                <TextField id="email" size="small" fullWidth disabled value={profile.email} />
                            </LabeledField>
                        </Grid>
                    </Grid>
                </Stack>
            </form>
        </Paper>
    );
}
