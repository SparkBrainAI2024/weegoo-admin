import { ReactNode } from 'react';
import { Stack, Typography } from '@mui/material';

interface Props {
    label: string;
    htmlFor: string;
    children: ReactNode;
}

export default function LabeledField({ label, htmlFor, children }: Props) {
    return (
        <Stack gap={0.75}>
            <Typography variant="subtitle2" component="label" htmlFor={htmlFor}>
                {label}
            </Typography>
            {children}
        </Stack>
    );
}
