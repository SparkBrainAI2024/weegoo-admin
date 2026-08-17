import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, TextField, Button, Stack } from '@mui/material';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { DriverDocumentFileRow } from 'utils/document.utils';

interface DocumentPreviewCardProps {
    document: DriverDocumentFileRow | null;
    onApprove: () => void;
    onReject: (rejectionReason: string) => void;
    submitting?: boolean;
}

export function DocumentPreviewCard({ document, onApprove, onReject, submitting }: DocumentPreviewCardProps) {
    // Local for now — this is the one piece of real interactivity in this
    // pass, the rest of the layout is still static. Once approve/reject
    // call into a mutation, the reason field's value goes along with it,
    // and clearing it on submit happens in that handler, not here.
    const [rejectionReason, setRejectionReason] = useState('');

    // Switching to a different document should clear whatever half-typed
    // reason was meant for the previous one — otherwise it's easy to reject
    // document B with a reason you actually wrote about document A.
    useEffect(() => {
        setRejectionReason('');
    }, [document?.id]);

    return (
        <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
                Document Preview
            </Typography>

            {/* flex: 1 with no minHeight — the card's height is fixed now
                (matches Figma's 404), so this box just absorbs whatever's
                left after the title, textarea, and button row take their
                natural height. The old minHeight: 220 was compensating for
                a variable-height parent; that parent doesn't vary anymore. */}
            <Box
                sx={{
                    flex: 1,
                    mb: 2,
                    borderRadius: 1,
                    bgcolor: 'action.hover',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1,
                    overflow: 'hidden'
                }}
            >
                {document?.viewUrl ? (
                    <Box
                        component="img"
                        src={document.viewUrl}
                        alt={document.label}
                        sx={{ maxWidth: '100%', objectFit: 'contain', padding: 3 }}
                    />
                ) : (
                    <>
                        <DescriptionOutlinedIcon color="disabled" />
                        <Typography variant="body2" color="text.secondary">
                            {document ? 'No preview available for this document' : 'Select a document to preview'}
                        </Typography>
                    </>
                )}
            </Box>

            <TextField
                placeholder="Write a reason for rejection..."
                multiline
                minRows={3}
                fullWidth
                size="small"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                sx={{ mb: 2 }}
            />

            {/* Reject is the "outlined danger" treatment (light red bg, red
                text, no border) rather than a filled error button — it's the
                secondary action next to Approve's filled green, not a
                destructive action on equal footing. Matches the reference. */}
            <Stack direction="row" gap={2} justifyContent="flex-end">
                <Button
                    variant="contained"
                    disableElevation
                    disabled={!document || !rejectionReason.trim() || submitting}
                    onClick={() => onReject(rejectionReason.trim())}
                    sx={{
                        bgcolor: 'error.lighter',
                        color: 'error.main',
                        boxShadow: 'none',
                        '&:hover': { bgcolor: 'error.light', boxShadow: 'none' }
                    }}
                >
                    Reject
                </Button>
                <Button variant="contained" color="success" disableElevation disabled={!document || submitting} onClick={onApprove}>
                    Approve
                </Button>
            </Stack>
        </Paper>
    );
}

export default DocumentPreviewCard;
