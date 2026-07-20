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
        <Paper variant="outlined" sx={{ p: 3 }}>
            <Typography variant="subtitle1" fontWeight={600}>
                Commission Summary
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
                10% commission collected from each ride
            </Typography>

            <Stack spacing={2}>
                <Box sx={{ bgcolor: '#fdecea', borderRadius: 2, p: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                        Outstanding to Pay
                    </Typography>
                    <Typography variant="h6">{fmt(summary?.outstandingToPay)}</Typography>
                </Box>

                <Box sx={{ border: '1px solid #4caf50', borderRadius: 2, p: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                        Commission Paid
                    </Typography>
                    <Typography variant="h6">{fmt(summary?.commissionPaid)}</Typography>
                </Box>

                <Box sx={{ bgcolor: '#f5f5f5', borderRadius: 2, p: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                        Total Rides
                    </Typography>
                    <Stack direction="row" justifyContent="space-between">
                        <Typography variant="h6">{summary?.totalRides ?? '-'}</Typography>
                        <Typography variant="caption" color="text.secondary" alignSelf="flex-end">
                            All time
                        </Typography>
                    </Stack>
                </Box>

                <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 2, p: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                        Last Settlement
                    </Typography>
                    <Stack direction="row" justifyContent="space-between">
                        <Typography>{summary?.lastSettlementDate ?? '-'}</Typography>
                        <Typography>{fmt(summary?.lastSettlementAmount)}</Typography>
                    </Stack>
                    <Typography variant="caption" color="text.secondary">
                        Method: {summary?.lastSettlementMethod ?? '-'}
                    </Typography>
                </Box>

                <Button variant="contained" sx={{ bgcolor: '#111', '&:hover': { bgcolor: '#000' } }}>
                    Notify Driver
                </Button>
            </Stack>
        </Paper>
    );
}
