import React, { useState } from 'react';
import { Box, Alert, CircularProgress } from '@mui/material';
import { useQuery, useMutation } from '@apollo/client/react';
import KycDocumentsCard from './KYCDocumentsCard';
import VerificationChecklistCard from './verificationChecklistCard';
import VehicleInformationCard from './VehicleInformationCard';
import DocumentPreviewCard from './DocumentPreviewCard';
import { GET_DRIVER_DOCUMENTS, GetDriverDocumentsData, GetDriverVars } from 'graphql/queries/drivers.queries';
import { flattenDriverDocuments } from 'utils/document.utils';
import { APPROVE_DRIVER_DOCUMENT_FILE, REJECT_DRIVER_DOCUMENT_FILE } from 'graphql/mutations/driver.mutation';

interface DocumentsTabLayoutProps {
    driverId: string;
}

export function DocumentsTabLayout({ driverId }: DocumentsTabLayoutProps) {
    const { data, loading, error } = useQuery<GetDriverDocumentsData, GetDriverVars>(GET_DRIVER_DOCUMENTS, {
        variables: { driverId },
        skip: !driverId
    });
    console.log({ data, error, loading }, 'data');

    // Not memoized (no useMemo) — data.getDriver.documents is already a new
    // reference on every fetch/refetch anyway (Apollo's normalized cache
    // read builds a fresh object each time), so memoizing against it buys
    // nothing here. Worth reconsidering only if flattenDriverDocuments turns
    // out to be doing real work on a large document list.
    const documentRows = flattenDriverDocuments(data?.getDriver?.documents ?? []);

    const [selectedDocumentId, setSelectedDocumentId] = useState<string>('');
    // Falls back to the first row once data arrives and nothing's been
    // explicitly clicked yet — mirrors the mock-data version's behavior,
    // now driven by query data instead of a static array.
    const activeDocumentId = selectedDocumentId || documentRows[0]?.id || '';
    const selectedDocument = documentRows.find((row) => row.id === activeDocumentId) ?? null;

    const [approveFile, { loading: approving }] = useMutation(APPROVE_DRIVER_DOCUMENT_FILE, {
        refetchQueries: ['GetDriverDocuments']
    });
    const [rejectFile, { loading: rejecting }] = useMutation(REJECT_DRIVER_DOCUMENT_FILE, {
        refetchQueries: ['GetDriverDocuments']
    });

    const handleApprove = () => {
        if (!selectedDocument) return;
        approveFile({ variables: { input: { documentFileId: selectedDocument.id } } });
    };

    const handleReject = (rejectionReason: string) => {
        if (!selectedDocument) return;
        rejectFile({ variables: { input: { documentFileId: selectedDocument.id, rejectionReason } } });
    };

    if (error) {
        return <Alert severity="error">Failed to load documents: {error.message}</Alert>;
    }

    return (
        <Box
            sx={{
                display: 'grid',
                gap: 3,
                gridTemplateAreas: {
                    xs: `"list" "detail"`,
                    md: `"list detail"`
                },
                gridTemplateColumns: {
                    xs: '1fr',
                    md: '5fr 4fr'
                }
            }}
        >
            <Box sx={{ gridArea: 'list', display: 'flex', flexDirection: 'column', gap: 3 }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                        <CircularProgress size={24} />
                    </Box>
                ) : (
                    <KycDocumentsCard
                        minHeight={470}
                        documents={documentRows}
                        selectedDocumentId={activeDocumentId}
                        onSelect={setSelectedDocumentId}
                    />
                )}
                <VerificationChecklistCard minHeight={140} />
            </Box>

            <Box sx={{ gridArea: 'detail', display: 'flex', flexDirection: 'column', gap: 3 }}>
                <VehicleInformationCard minHeight={140} />
                <DocumentPreviewCard
                    minHeight={320}
                    document={selectedDocument}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    submitting={approving || rejecting}
                />
            </Box>
        </Box>
    );
}

export default DocumentsTabLayout;
