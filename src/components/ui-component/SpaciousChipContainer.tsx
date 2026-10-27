import { Stack } from '@mui/material';
import Chip from 'components/ui-component/extended/Chip';

export const SpaciousChipContainer = ({ label, color, icon }: { label: string; color: string; icon?: React.ReactElement }) => {
    return (
        <Stack direction="row" sx={{ width: 'fit-content' }}>
            <Chip label={label} size="small" chipcolor={color} icon={icon} sx={{ paddingLeft: 2, paddingRight: 2, height: 32 }} />
        </Stack>
    );
};
