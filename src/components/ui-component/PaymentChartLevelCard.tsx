import { Card, CardContent, CardHeader, Typography } from '@mui/material';
import { ReactNode } from 'react';

interface Props {
    title: string;
    action?: ReactNode;
    children: ReactNode;
}

export default function PaymentChartLevelCard({ title, action, children }: Props) {
    return (
        <Card sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardHeader
                title={<Typography variant="subtitle1">{title}</Typography>}
                action={action}
                sx={{ p: 1.5, '& .MuiCardHeader-action': { m: 0, alignSelf: 'center' } }}
            />
            <CardContent
                sx={{
                    flex: 1,
                    minHeight: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    p: 1.5,
                    pt: 0,
                    '&:last-child': { pb: 1.5 },
                    justifyContent: 'center', // vertical (column direction)
                    alignItems: 'center'
                }}
            >
                {children}
            </CardContent>
        </Card>
    );
}
