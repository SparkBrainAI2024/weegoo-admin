import React from 'react';
import { Box, Paper, Typography, Stack, LinearProgress } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

// ---------------------------------------------------------------------------
// STATIC MOCK DATA — same idea as the documents table: real-shaped labels
// (some short, some longer) so we can see how the row wraps before wiring
// it to the real per-document APPROVED/PENDING statuses.
// ---------------------------------------------------------------------------
const MOCK_CHECKLIST = [
    { label: 'Citizenship', verified: true },
    { label: 'Driving License', verified: true },
    { label: 'Bluebook', verified: true },
    { label: 'Vehicle Registration', verified: false }
];

export function VerificationChecklistCard({ minHeight }: { minHeight: number }) {
    const verifiedCount = MOCK_CHECKLIST.filter((c) => c.verified).length;
    const progress = (verifiedCount / MOCK_CHECKLIST.length) * 100;

    return (
        <Paper sx={{ p: 3, minHeight }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
                Verification Checklist
            </Typography>

            {/* Row of checklist items — wraps on narrow widths since it's a
                flex row with flexWrap, not a fixed grid. That matters here
                because "Vehicle Registration" is roughly 2x the width of
                "Bluebook", and we don't want four evenly-spaced columns
                fighting that difference. */}
            <Stack direction="row" flexWrap="wrap" gap={4} sx={{ mb: 2 }}>
                {MOCK_CHECKLIST.map((item) => (
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
                {verifiedCount} of {MOCK_CHECKLIST.length} documents verified
            </Typography>
        </Paper>
    );
}

export default VerificationChecklistCard;
