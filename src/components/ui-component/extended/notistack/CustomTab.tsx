import { Tab, TabProps, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import CountChip from './Chip';

const StyledTab = styled(Tab)(() => ({
    color: '#595959',
    minHeight: 36,
    textTransform: 'none',
    border: '1px solid rgba(128, 128, 128, 0.3)', // reserve space so layout doesn't shift on select
    '&.Mui-selected': {
        color: '#202020',
        borderColor: '#6EE83A',
        borderWidth: '2px', // you said 1px earlier for the chip context — 4px will look thick, confirm which you want
        borderStyle: 'solid'
    }
}));

interface CustomTabProps extends TabProps {
    count?: number | string;
}

export default function CustomTab({ label, count, value, ...props }: CustomTabProps) {
    console.log(props, 'key');

    return (
        <StyledTab
            {...props}
            label={
                <Stack direction="row" spacing={0.75} alignItems="center">
                    {value === 'ACTIVE' ? (
                        <span>{label}</span>
                    ) : (
                        <>
                            <span>{label}</span>
                            <CountChip count={count} />
                        </>
                    )}
                </Stack>
            }
        />
    );
}
