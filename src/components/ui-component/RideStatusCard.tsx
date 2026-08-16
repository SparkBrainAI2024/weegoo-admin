import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { SpaciousChipContainer } from './SpaciousChipContainer';

interface RideStatusCardProps {
    status: string;
    startedAt?: string;
}

const STATUS_COLOR_MAP: Record<string, 'warning' | 'success' | 'error' | 'info' | 'default'> = {
    ONGOING: 'warning',
    COMPLETED: 'success',
    CANCELLED: 'error',
    PENDING: 'info'
};

const formatDateTime = (iso?: string) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
};

const RideStatusCard = ({ status, startedAt }: RideStatusCardProps) => {
    const statusColor = STATUS_COLOR_MAP[status?.toUpperCase()] ?? 'default';
    const statusLabel = status ? status.charAt(0) + status.slice(1).toLowerCase() : '—';

    return (
        <Paper variant="outlined" sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'start' }}>
            <SpaciousChipContainer label={statusLabel} color={statusColor} />
            <Box textAlign="left">
                <Typography variant="body1" color="text.secondary" display="block">
                    Started At
                </Typography>
                <Typography variant="subtitle1">{formatDateTime(startedAt)}</Typography>
            </Box>
        </Paper>
    );
};

export default RideStatusCard;
