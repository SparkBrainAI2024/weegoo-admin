import { Avatar, Chip, Paper, Stack, Typography } from '@mui/material';

interface Props {
    fullName: string;
    email: string;
    phone?: string | null;
}

const initials = (name: string) =>
    name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase())
        .join('');

export default function ProfileHeaderCard({ fullName, email, phone }: Props) {
    return (
        <Paper elevation={1} sx={{ p: 3, borderRadius: 3 }}>
            <Stack direction="row" alignItems="center" gap={2.5}>
                <Avatar sx={{ width: 60, height: 60, bgcolor: 'success.main' }}>{initials(fullName)}</Avatar>

                <Stack gap={0.5}>
                    <Stack direction="row" alignItems="center" gap={1.5}>
                        <Typography variant="h3">{fullName}</Typography>
                        <Chip label="Super Admin" size="small" color="success" variant="outlined" />
                    </Stack>

                    <Stack direction="row" alignItems="center" gap={1}>
                        <Typography variant="body2" color="text.secondary">
                            {email}
                        </Typography>
                        {phone && (
                            <>
                                <Typography variant="body2" color="text.secondary">
                                    •
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    +977 {phone}
                                </Typography>
                            </>
                        )}
                    </Stack>
                </Stack>
            </Stack>
        </Paper>
    );
}
