import { Typography } from '@mui/material';

export const RideDetailSubtitle2 = ({ label }: { label: string }) => {
    return (
        <>
            <Typography variant="subtitle2" sx={{ textTransform: 'uppercase' }}>
                {label}
            </Typography>
        </>
    );
};

export const RideDetailSubtitle = ({ label }: { label: string }) => {
    return (
        <>
            <Typography variant="h6" sx={{ textTransform: 'uppercase', letterSpacing: '1px' }}>
                {label}
            </Typography>
        </>
    );
};

export const FieldAndFieldValue = ({ label, value }: { label: string; value: string }) => {
    return (
        <>
            <RideDetailSubtitle label={label}></RideDetailSubtitle>
            <Typography variant="body3">{value}</Typography>
        </>
    );
};
