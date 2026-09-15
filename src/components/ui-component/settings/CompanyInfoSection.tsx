import { useEffect, useState } from 'react';
import { Grid, TextField, Typography, Box, Button, Paper, Skeleton } from '@mui/material';
import { useCompanyInfo } from 'hooks/useCompanyInfo';

export default function CompanyInfoSection() {
    const { data, loading, saving, save } = useCompanyInfo();
    const [form, setForm] = useState({ companyName: '', supportEmail: '' });

    useEffect(() => {
        if (data) setForm(data);
    }, [data]);

    const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const handleCancel = () => {
        if (data) setForm(data);
    };

    const handleSave = () => {
        save(form);
    };

    if (loading) {
        return (
            <Box>
                <Skeleton height={40} width={200} />
                <Skeleton height={56} sx={{ mt: 2 }} />
                <Skeleton height={56} sx={{ mt: 2 }} />
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h5" fontWeight={600}>
                Company Info
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Basic company settings used across the CMS and apps
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <TextField label="Company Name" fullWidth value={form.companyName} onChange={handleChange('companyName')} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField label="Support Email" fullWidth value={form.supportEmail} onChange={handleChange('supportEmail')} />
                </Grid>
            </Grid>

            <Paper
                elevation={0}
                sx={{
                    mt: 4,
                    p: 2,
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
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button variant="outlined" color="inherit" onClick={handleCancel} disabled={saving}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="warning" onClick={handleSave} disabled={saving}>
                        {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
}
