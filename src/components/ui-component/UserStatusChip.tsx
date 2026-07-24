// components/ui-component/UserStatusChip.tsx
import { Chip, Typography } from '@mui/material';

const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
    ACTIVE: { label: 'Active', bg: '#EAF4EC', text: '#2E7D32' },
    PENDING: { label: 'Pending', bg: '#FFF4D6', text: '#7A5A00' },
    BLOCKED: { label: 'Blocked', bg: '#FDE8E6', text: '#F24338' }
};

export const UserStatusChip = ({ status }: { status: string }) => {
    const config = statusConfig[status] ?? statusConfig.PENDING;

    return (
        <Chip
            label={
                <Typography component="span" sx={{ fontSize: '12px', fontWeight: 700, color: config.text }}>
                    {config.label}
                </Typography>
            }
            size="small"
            sx={{
                bgcolor: config.bg,
                borderRadius: '6px'
            }}
        />
    );
};
