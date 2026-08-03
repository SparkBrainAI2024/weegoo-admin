import React from 'react';
import { Box, Paper, Typography, Table, TableHead, TableRow, TableCell, TableBody, Chip, Button, Stack } from '@mui/material';
import { DriverDocumentFileRow } from 'utils/document.utils';

// File-level status per DocumentFile's status field (@libs/data-access
// enums/upload.enum -> DocumentFileStatus): PENDING | VERIFIED | REJECTED.
// Not APPROVED — that word only shows up at the bundle-status level
// (DriverDocumentBundleStatus), which this table isn't rendering.
const statusChipColor: Record<string, 'success' | 'warning' | 'error' | 'default'> = {
    VERIFIED: 'success',
    PENDING: 'warning',
    REJECTED: 'error'
};

interface KycDocumentsCardProps {
    minHeight: number;
    documents: DriverDocumentFileRow[];
    selectedDocumentId: string;
    onSelect: (id: string) => void;
}

export function KycDocumentsCard({ minHeight, documents, selectedDocumentId, onSelect }: KycDocumentsCardProps) {
    return (
        <Paper sx={{ p: 3, minHeight }}>
            <Box sx={{ mb: 2 }}>
                <Typography variant="h6">KYC Documents</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Review uploaded documents and update status
                </Typography>
            </Box>

            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Document</TableCell>
                        <TableCell>Uploaded</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {documents.map((row) => (
                        <TableRow
                            key={row.id}
                            hover
                            selected={row.id === selectedDocumentId}
                            // Row itself isn't clickable — only the Preview button
                            // triggers selection, matching the reference UI where
                            // Preview/Download are the two explicit actions per row.
                            // `selected` still highlights the row so it's visible
                            // which document the right-hand panel is showing.
                        >
                            <TableCell>
                                <Typography variant="body2" fontWeight={600}>
                                    {row.label}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="body2" color="text.secondary">
                                    {row.uploaded}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Chip label={row.status} color={statusChipColor[row.status]} size="small" />
                            </TableCell>
                            <TableCell align="right">
                                <Stack direction="row" gap={1} justifyContent="flex-end">
                                    <Button
                                        size="small"
                                        variant={row.id === selectedDocumentId ? 'contained' : 'outlined'}
                                        disableElevation
                                        onClick={() => onSelect(row.id)}
                                    >
                                        Preview
                                    </Button>
                                    {row.downloadUrl ? (
                                        <Button
                                            size="small"
                                            variant="contained"
                                            disableElevation
                                            href={row.downloadUrl}
                                            target="_blank"
                                            rel="noopener"
                                        >
                                            Download
                                        </Button>
                                    ) : (
                                        <Button size="small" variant="contained" disableElevation disabled>
                                            Download
                                        </Button>
                                    )}
                                </Stack>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
}

export default KycDocumentsCard;
