import { Stack } from '@mui/material';
import Chip from 'components/ui-component/extended/Chip';

export const SpaciousChipContainer = ({ label, color }: { label: string; color: string }) => {
    return (
        <Stack direction="row" sx={{ width: 'fit-content' }}>
            <Chip label={label} size="small" chipcolor={color} sx={{ paddingLeft: 2, paddingRight: 2, height: 32 }} />
        </Stack>
    );
};
