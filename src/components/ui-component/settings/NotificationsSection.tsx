import { useState } from 'react';
import { Box, Typography, Chip, TextField, Button, Paper } from '@mui/material';
import { NotificationAudience } from 'graphql/mutations/settings.mutation';
import { useSendNotification } from 'hooks/useSendNotification';

const AUDIENCE_OPTIONS: { value: NotificationAudience; label: string }[] = [
    { value: 'riders', label: 'All Riders' },
    { value: 'drivers', label: 'All Drivers' },
    { value: 'both', label: 'Both' }
];

export default function NotificationsSection() {
    const { send, sending } = useSendNotification();
    const [audience, setAudience] = useState<NotificationAudience>('both');
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSend = () => {
        if (!title.trim() || !message.trim()) {
            setError('Title and message are required');
            return;
        }
        setError('');
        send({ audience, title, message }).then(() => {
            setTitle('');
            setMessage('');
        });
    };

    return (
        <Box>
            <Typography variant="h5" fontWeight={600}>
                Send Push Notification
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Send a generic push notification to all users
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                {AUDIENCE_OPTIONS.map((opt) => (
                    <Chip
                        key={opt.value}
                        label={opt.label}
                        onClick={() => setAudience(opt.value)}
                        color={audience === opt.value ? 'warning' : 'default'}
                        variant={audience === opt.value ? 'filled' : 'outlined'}
                    />
                ))}
            </Box>

            <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
                <TextField
                    label="Notification Title"
                    placeholder="Important Update"
                    fullWidth
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <TextField
                    label="Message"
                    placeholder="We have updated pricing rules. Please check the app for details."
                    fullWidth
                    multiline
                    minRows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
            </Box>

            {error && (
                <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
                    {error}
                </Typography>
            )}

            <Paper
                elevation={0}
                sx={{
                    mt: 4,
                    p: 2,
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
    );
}
