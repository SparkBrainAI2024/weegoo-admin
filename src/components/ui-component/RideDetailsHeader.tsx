import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface RideDetailHeaderProps {
    rideUUId?: string;
    status: string;
    startedAt?: string;
    onBack: () => void;
}

const STATUS_COLOR_MAP: Record<string, 'warning' | 'success' | 'error' | 'info' | 'default'> = {
    ONGOING: 'warning',
    COMPLETED: 'success',
    CANCELLED: 'error',
    PENDING: 'info'
};

const formatDateTime = (iso?: string) => {
    if (!iso) return '—';
    const date = new Date(iso);
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
};

const RideDetailHeader = ({ rideUUId, status, startedAt, onBack }: RideDetailHeaderProps) => {
    const statusColor = STATUS_COLOR_MAP[status?.toUpperCase()] ?? 'default';
    const statusLabel = status ? status.charAt(0) + status.slice(1).toLowerCase() : '—';

    return (
        <Paper
            variant="outlined"
            sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}
        >
            <Stack direction="row" alignItems="center" spacing={1.5}>
                <IconButton onClick={onBack} size="small" aria-label="Back">
                    <ArrowBackIcon fontSize="small" />
                </IconButton>
                <Typography variant="h5" fontWeight={700}>
                    Ride Details
                </Typography>
                {rideUUId && <Chip label={`#${rideUUId}`} size="small" sx={{ bgcolor: 'grey.100', fontWeight: 500 }} />}
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
                <Chip label={statusLabel} color={statusColor} size="small" sx={{ fontWeight: 600 }} />
                <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                        Started At
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                        {formatDateTime(startedAt)}
                    </Typography>
                </Box>
            </Stack>
        </Paper>
    );
};

export default RideDetailHeader;
