import { useEffect, useState } from 'react';
import { Box, Typography, Switch, TextField, Paper, Button, Skeleton, Stack } from '@mui/material';
import { useMaintenanceStatus } from 'hooks/useMaintenance';
import useNotification from 'hooks/useNotification';
import NotificationBanner from '../snackbar/AppSnackBar';

export default function MaintenanceSection() {
    const { data, loading, saving, save } = useMaintenanceStatus();
    const { showSuccess, showError, notification, clearNotification } = useNotification();

    // enabled toggle is local-only for now — no backend field yet
    const [enabled, setEnabled] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState<string | undefined>();

    useEffect(() => {
        if (data) setMessage(data.message);
    }, [data]);

    const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEnabled(e.target.checked);
    };

    const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value);
    };

    const handleCancel = () => {
        if (data) setMessage(data.message);
        setError(undefined);
    };

    const handleSave = async () => {
        if (!message.trim()) {
            setError('Maintenance message is required');
            return;
        }
        setError(undefined);
        try {
            await save({ message });
            showSuccess('Maintenance settings updated successfully');
        } catch {
            showError('Failed to update maintenance settings');
        }
    };

    if (loading) {
        return (
            <Box sx={{ p: 3 }}>
                <Skeleton height={32} width={220} />
                <Skeleton height={20} width={360} sx={{ mt: 1 }} />
                <Skeleton height={80} sx={{ mt: 3 }} />
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
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
                    <Stack spacing={0.5}>
                        <Typography variant="h4" fontWeight={600}>
                            Maintenance Mode
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Temporarily disable rider/driver apps (for updates or emergencies)
                        </Typography>
                    </Stack>
                    <Switch checked={enabled} onChange={handleToggle} />
                </Box>

                <Stack spacing={1}>
                    <Stack spacing={0.5}>
                        <Typography variant="subtitle1" fontWeight={600}>
                            Maintenance Message
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Users will see this message in the app
                        </Typography>
                    </Stack>
                    <TextField
                        fullWidth
                        multiline
                        minRows={3}
                        value={message}
                        onChange={handleMessageChange}
                        placeholder="We are updating the service. Please try again soon."
                        error={!!error}
                        helperText={error}
                    />
                </Stack>

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
                        Save changes to apply Maintenance settings.
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
