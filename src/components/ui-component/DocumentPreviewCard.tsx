import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, TextField, Button, Stack } from '@mui/material';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { DriverDocumentFileRow } from 'utils/document.utils';

interface DocumentPreviewCardProps {
    minHeight: number;
    document: DriverDocumentFileRow | null;
}

export function DocumentPreviewCard({ minHeight, document }: DocumentPreviewCardProps) {
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
        <Paper sx={{ p: 3, minHeight, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
                Document Preview
            </Typography>

            {/* Preview area — flex: 1 so it absorbs whatever extra height the
                card has, rather than a fixed px value. That matters because
                this card sits in the same column as VehicleInformationCard,
                whose height varies with field count, so a fixed height here
                would either clip or leave a gap depending on content above it. */}
            <Box
                sx={{
                    flex: 1,
                    minHeight: 220,
                    mb: 2,
                    borderRadius: 1,
                    bgcolor: 'action.hover',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1
                }}
            >
                {document?.viewUrl ? (
                    <Box
                        component="img"
                        src={document.viewUrl}
                        alt={document.label}
                        sx={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
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
                    disabled={!document || !rejectionReason.trim()}
                    sx={{
                        bgcolor: 'error.lighter',
                        color: 'error.main',
                        boxShadow: 'none',
                        '&:hover': { bgcolor: 'error.light', boxShadow: 'none' }
                    }}
                >
                    Reject
                </Button>
                <Button variant="contained" color="success" disableElevation disabled={!document}>
                    Approve
                </Button>
            </Stack>
        </Paper>
    );
}

export default DocumentPreviewCard;
