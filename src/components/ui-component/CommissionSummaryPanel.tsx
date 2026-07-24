import { useQuery } from '@apollo/client/react';
import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import {
    DriverCommissionSummaryQuery,
    DriverCommissionSummaryQueryVariables,
    GET_DRIVER_COMMISSION_SUMMARY
} from 'graphql/queries/driver-trips.queries';

const fmt = (v?: number | null) => (v == null ? '-' : `Rs. ${v}`);

interface Props {
    driverId: string;
}

export function CommissionSummaryPanel({ driverId }: Props) {
    const { data } = useQuery<DriverCommissionSummaryQuery, DriverCommissionSummaryQueryVariables>(GET_DRIVER_COMMISSION_SUMMARY, {
        variables: { driverId }
    });

    const summary = data?.driverCommissionSummary;

    return (
        <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography sx={{ fontSize: 12, fontWeight: 400, color: '#2A2A2A' }}>Commission Summary</Typography>
            <Typography sx={{ fontSize: 11, fontWeight: 400, color: '#6F6F6E', mb: 1.5 }}>
                10% commission collected from each ride
            </Typography>

            <Stack spacing={1.25}>
                <Box sx={{ bgcolor: '#fdecea', borderRadius: 2, p: 1.5 }}>
                    <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>Outstanding to Pay</Typography>
                    <Typography sx={{ fontSize: 15, fontWeight: 600 }}>{fmt(summary?.outstandingToPay)}</Typography>
                </Box>

                <Box sx={{ border: '1px solid #4caf50', borderRadius: 2, p: 1.5 }}>
                    <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>Commission Paid</Typography>
                    <Typography sx={{ fontSize: 15, fontWeight: 600 }}>{fmt(summary?.commissionPaid)}</Typography>
                </Box>

                <Box sx={{ bgcolor: '#f5f5f5', borderRadius: 2, p: 1.5 }}>
                    <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>Total Rides</Typography>
                    <Stack direction="row" justifyContent="space-between">
                        <Typography sx={{ fontSize: 15, fontWeight: 600 }}>{summary?.totalRides ?? '-'}</Typography>
                        <Typography sx={{ fontSize: 10, color: 'text.secondary', alignSelf: 'flex-end' }}>All time</Typography>
                    </Stack>
                </Box>

                <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 2, p: 1.5 }}>
                    <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>Last Settlement</Typography>
                    <Stack direction="row" justifyContent="space-between">
                        <Typography sx={{ fontSize: 12 }}>{summary?.lastSettlementDate ?? '-'}</Typography>
                        <Typography sx={{ fontSize: 12 }}>{fmt(summary?.lastSettlementAmount)}</Typography>
                    </Stack>
                    <Typography sx={{ fontSize: 10, color: 'text.secondary' }}>Method: {summary?.lastSettlementMethod ?? '-'}</Typography>
                </Box>

                <Button variant="contained" size="small" sx={{ bgcolor: '#111', fontSize: 12, '&:hover': { bgcolor: '#000' } }}>
                    Notify Driver
                </Button>
            </Stack>
        </Paper>
    );
}
