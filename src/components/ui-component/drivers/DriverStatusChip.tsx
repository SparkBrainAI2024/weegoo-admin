// components/drivers/DriverStatusChip.tsx
import { Chip } from '@mui/material';

const statusConfig: Record<string, { label: string; color: 'success' | 'warning' | 'error' }> = {
    ACTIVE: { label: 'Active', color: 'success' },
    PENDING: { label: 'Pending', color: 'warning' },
    BLOCKED: { label: 'Blocked', color: 'error' }
};

export const DriverStatusChip = ({ status }: { status: string }) => {
    const config = statusConfig[status] ?? statusConfig.PENDING;
    return <Chip label={config.label} color={config.color} size="small" sx={{ fontWeight: 500, borderRadius: '6px' }} />;
};
