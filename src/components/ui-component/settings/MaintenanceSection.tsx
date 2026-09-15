import { useEffect, useState } from 'react';
import { Box, Typography, Switch, TextField, Paper, Button, Skeleton, FormControlLabel } from '@mui/material';
import { useMaintenanceStatus } from 'hooks/useMaintenance';

export default function MaintenanceSection() {
    const { data, loading, saving, save } = useMaintenanceStatus();
    const [form, setForm] = useState({ enabled: false, message: '' });

    useEffect(() => {
        if (data) setForm(data);
    }, [data]);

    const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, enabled: e.target.checked }));
    };

    const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setForm((prev) => ({ ...prev, message: e.target.value }));
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
                <Skeleton height={40} width={220} />
                <Skeleton height={80} sx={{ mt: 2 }} />
            </Box>
        );
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                    <Typography variant="h5" fontWeight={600}>
                        Maintenance Mode
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Temporarily disable rider/driver apps (for updates or emergencies)
                    </Typography>
                </Box>
                <Switch checked={form.enabled} onChange={handleToggle} />
            </Box>

            <Box sx={{ mt: 3 }}>
                <FormControlLabel
                    control={<Box />}
                    label={
                        <Box>
                            <Typography variant="subtitle1" fontWeight={600}>
                                Maintenance Message
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Users will see this message in the app
                            </Typography>
                        </Box>
                    }
                    sx={{ ml: 0, mb: 1 }}
                />
                <TextField
                    fullWidth
                    multiline
                    minRows={3}
                    value={form.message}
                    onChange={handleMessageChange}
                    placeholder="We are updating the service. Please try again soon."
                />
            </Box>

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
                    Save changes to apply Maintenance settings.
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
