import React from 'react';
import { Box, Paper, Typography, Stack, LinearProgress } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

export function VerificationChecklistCard({ docWiseStatus }: { docWiseStatus: { label: string; verified: boolean }[] }) {
    const verifiedCount = docWiseStatus?.filter((c) => c.verified).length;
    const progress = (verifiedCount / docWiseStatus.length) * 100;
    const sortedChecklist = [...docWiseStatus].sort((a, b) => Number(b.verified) - Number(a.verified));
    return (
        <Paper sx={{ p: 3, overflowY: 'auto' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
                Verification Checklist
            </Typography>

            <Stack direction="row" flexWrap="wrap" gap={4} sx={{ mb: 2 }}>
                {sortedChecklist?.map((item) => (
                    <Stack key={item.label} direction="row" gap={1} alignItems="flex-start">
                        {item.verified ? (
                            <CheckCircleIcon color="success" fontSize="small" />
                        ) : (
                            <RadioButtonUncheckedIcon color="disabled" fontSize="small" />
                        )}
                        <Box>
                            <Typography variant="body2" fontWeight={600}>
                                {item.label}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {item.verified ? 'Verified' : 'Pending'}
                            </Typography>
                        </Box>
                    </Stack>
                ))}
            </Stack>

            <LinearProgress variant="determinate" value={progress} sx={{ height: 6, borderRadius: 3 }} />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                {verifiedCount} of {docWiseStatus.length} documents verified
            </Typography>
        </Paper>
    );
}

export default VerificationChecklistCard;
