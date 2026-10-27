import { ToggleButtonGroup, ToggleButton, Typography, Box } from '@mui/material';
import { useUrlParams } from 'hooks/useSearchParams';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const TABS = [
    { key: '', label: 'All', icon: null },
    { key: 'INSTANT', label: 'Instant', icon: <FlashOnIcon sx={{ fontSize: 16, color: '#4CAF50' }} /> },
    { key: 'SCHEDULED', label: 'Scheduled', icon: <AccessTimeIcon sx={{ fontSize: 16, color: '#6D28D9' }} /> }
];

export default function RideToggleFilter() {
    const { getParam, updateParams } = useUrlParams();
    const type = getParam<string>('type', '');

    return (
        <ToggleButtonGroup
            value={type}
            exclusive
            onChange={(_, newType) => newType !== null && updateParams({ type: newType }, { resetKeys: ['page'] })}
            size="small"
            sx={{
                borderRadius: '10px',
                p: 0.5,
                '& .MuiToggleButton-root': {
                    textTransform: 'none',
                    padding: '8px 20px',
                    border: '5px  solid #D1D5DB',
                    px: 2.5,
                    py: 0.75
                },
                '& .MuiToggleButtonGroup-grouped': {
                    border: '1.78pxpx solid #D1D5DB !important',
                    borderRadius: '20px !important',
                    textTransform: 'none',
                    px: 2.5,
                    py: 0.75
                },
                '& .Mui-selected': {
                    bgcolor: '#3DBB1F !important',
                    '&:hover': { bgcolor: 'grey.800 !important' }
                }
            }}
        >
            {TABS.map(({ key, label, icon }) => (
                <ToggleButton key={key} value={key}>
                    <Box display="flex" alignItems="center" gap={0.5}>
                        {icon}
                        <Typography
                            variant="subtitle2"
                            sx={{
                                fontSize: '13px',
                                color: type === key ? 'grey.200' : 'text.primary'
                            }}
                        >
                            {label}
                        </Typography>
                    </Box>
                </ToggleButton>
            ))}
        </ToggleButtonGroup>
    );
}
