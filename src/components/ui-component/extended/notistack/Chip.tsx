import { Chip, ChipProps } from '@mui/material';

interface CountChipProps extends Omit<ChipProps, 'color'> {
    count?: number | string;
}

export default function CountChip({ count, sx, ...props }: CountChipProps) {
    if (count === undefined || count === null) return null;

    return (
        <Chip
            label={count}
            size="small"
            sx={{
                height: 20,
                fontSize: 12,
                fontWeight: 400,
                borderRadius: '10px',
                bgcolor: '#DCDADA',
                color: '#202020',
                '& .MuiChip-label': { px: 0.75 },
                ...sx
            }}
            {...props}
        />
    );
}
