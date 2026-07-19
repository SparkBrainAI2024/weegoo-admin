import { Card, Stack, Typography } from '@mui/material';

export const DualStatCard = ({
    firstLabel,
    firstValue,
    secondLabel,
    secondValue
}: {
    firstLabel: string;
    firstValue: string;
    secondLabel: string;
    secondValue: string;
}) => (
    <Card
        sx={{
            p: 2.5,
            borderRadius: '12px',
            boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)'
        }}
    >
        <Stack direction="row" justifyContent="space-between">
            <Stack spacing={1}>
                <Typography variant="body2" color="text.secondary">
                    {firstLabel}
                </Typography>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="h3" fontWeight={600}>
                        {firstValue}
                    </Typography>
                </Stack>
            </Stack>
            <Stack spacing={1}>
                <Typography variant="body2" color="text.secondary">
                    {secondLabel}
                </Typography>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="h3" fontWeight={600}>
                        {secondValue}
                    </Typography>
                </Stack>
            </Stack>
        </Stack>
    </Card>
);
