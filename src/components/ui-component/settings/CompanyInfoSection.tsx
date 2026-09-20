import { useEffect, useState } from 'react';
import { Grid, TextField, Typography, Box, Button, Paper, Skeleton, Stack } from '@mui/material';
import { useCompanyInfo } from 'hooks/useCompanyInfo';
import NotificationBanner from '../snackbar/AppSnackBar';
import useNotification from 'hooks/useNotification';

export default function CompanyInfoSection() {
    const { data, loading, saving, save } = useCompanyInfo();
    const { showSuccess, showError, notification, clearNotification } = useNotification();

    const [form, setForm] = useState({ companyName: '', supportEmail: '' });
    const [errors, setErrors] = useState<{ companyName?: string; supportEmail?: string }>({});

    useEffect(() => {
        if (data) setForm({ companyName: data.companyName, supportEmail: data.supportEmail });
    }, [data]);

    const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const handleCancel = () => {
        if (data) setForm({ companyName: data.companyName, supportEmail: data.supportEmail });
        setErrors({});
    };

    const validate = () => {
        const newErrors: typeof errors = {};
        if (!form.companyName.trim() || form.companyName.trim().length < 2) {
            newErrors.companyName = 'Company name must be at least 2 characters';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!form.supportEmail.trim() || !emailRegex.test(form.supportEmail)) {
            newErrors.supportEmail = 'Enter a valid email address';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) return;
        try {
            await save(form);
            showSuccess('Company info updated successfully');
        } catch {
            showError('Failed to update company info');
        }
    };

    if (loading) {
        return (
            <Box sx={{ p: 3 }}>
                <Skeleton height={32} width={200} />
                <Skeleton height={20} width={320} sx={{ mt: 1 }} />
                <Skeleton height={56} sx={{ mt: 3 }} />
                <Skeleton height={56} sx={{ mt: 3 }} />
            </Box>
        );
    }

    return (
        <>
            <NotificationBanner
                open={Boolean(notification?.message)}
                message={notification?.message ?? ''}
                onClose={clearNotification}
                severity={notification?.severity ?? 'success'}
            />
            <Box sx={{ p: 3 }}>
                <Stack spacing={0.5} sx={{ mb: 4 }}>
                    <Typography variant="h4" fontWeight={600}>
                        Company Info
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Basic company settings used across the CMS and apps
                    </Typography>
                </Stack>

                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Stack spacing={1}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Company Name
                            </Typography>
                            <TextField
                                fullWidth
                                value={form.companyName}
                                onChange={handleChange('companyName')}
                                error={!!errors.companyName}
                                helperText={errors.companyName}
                            />
                        </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Stack spacing={1}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Support Email
                            </Typography>
                            <TextField
                                fullWidth
                                value={form.supportEmail}
                                onChange={handleChange('supportEmail')}
                                error={!!errors.supportEmail}
                                helperText={errors.supportEmail}
                            />
                        </Stack>
                    </Grid>
                </Grid>

                <Paper
                    elevation={0}
                    sx={{
                        mt: 5,
                        px: 3,
                        py: 2,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 2
                    }}
                >
                    <Typography variant="body2" color="text.secondary">
                        Save changes to apply Company settings.
                    </Typography>
                    <Stack direction="row" spacing={1.5}>
                        <Button variant="outlined" color="inherit" onClick={handleCancel} disabled={saving}>
                            Cancel
                        </Button>
                        <Button variant="contained" color="warning" onClick={handleSave} disabled={saving}>
                            {saving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </Stack>
                </Paper>
            </Box>
        </>
    );
}
