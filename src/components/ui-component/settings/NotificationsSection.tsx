import { useState } from 'react';
import { Box, Typography, Chip, TextField, Button, Paper, Stack } from '@mui/material';
import { PushNotificationTarget } from 'graphql/mutations/settings.mutation';
import { useSendNotification } from 'hooks/useSendNotification';
import NotificationBanner from '../snackbar/AppSnackBar';

const AUDIENCE_OPTIONS: { value: PushNotificationTarget; label: string }[] = [
    { value: PushNotificationTarget.USER, label: 'All Passengers' },
    { value: PushNotificationTarget.DRIVER, label: 'All Drivers' },
    { value: PushNotificationTarget.ALL, label: 'Both' }
];

export default function NotificationsSection() {
    const { send, sending } = useSendNotification();
    const { showSuccess, showError, notification, clearNotification } = useNotification();

    const [target, setTarget] = useState<PushNotificationTarget>(PushNotificationTarget.ALL);
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSend = async () => {
        if (!title.trim() || !message.trim()) {
            setError('Title and message are required');
            return;
        }
        setError('');
        try {
            const res = await send({ target, title, message });
            showSuccess(`Notification sent to ${res?.notifiedCount ?? 0} users`);
            setTitle('');
            setMessage('');
        } catch {
            showError('Failed to send notification');
        }
    };

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
                        Send Push Notification
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Send a generic push notification to all users
                    </Typography>
                </Stack>

                <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
                    {AUDIENCE_OPTIONS.map((opt) => (
                        <Chip
                            key={opt.value}
                            label={opt.label}
                            onClick={() => setTarget(opt.value)}
                            color={target === opt.value ? 'warning' : 'default'}
                            variant={target === opt.value ? 'filled' : 'outlined'}
                        />
                    ))}
                </Stack>

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                    <Stack spacing={1} sx={{ width: '100%' }}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Notification Title
                        </Typography>
                        <TextField fullWidth placeholder="Important Update" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </Stack>
                    <Stack spacing={1} sx={{ width: '100%' }}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Message
                        </Typography>
                        <TextField
                            fullWidth
                            multiline
                            minRows={3}
                            placeholder="We have updated pricing rules. Please check the app for details."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                    </Stack>
                </Stack>

                {error && (
                    <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1.5 }}>
                        {error}
                    </Typography>
                )}

                <Paper
                    elevation={0}
                    sx={{
                        mt: 5,
                        px: 3,
                        py: 2,
                        display: 'flex',
                        justifyContent: 'flex-end',
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 2
                    }}
                >
                    <Button
                        variant="contained"
                        color="inherit"
                        sx={{ bgcolor: 'black', color: 'white' }}
                        onClick={handleSend}
                        disabled={sending}
                    >
                        {sending ? 'Sending...' : 'Send'}
                    </Button>
                </Paper>
            </Box>
        </>
    );
}
