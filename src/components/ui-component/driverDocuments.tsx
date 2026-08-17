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

// Figma spec, whole-tab grid = 612px tall.
//   List column:   table 471 + gap X + checklist 120  = 612  ->  gap = 21
//   Detail column: vehicle 196 + gap Y + preview 404   = 612  ->  gap = 12
// The two gaps come out different from each other, which is worth
// double-checking directly in Figma's inspector rather than trusting this
// arithmetic blindly — 21px isn't a round number on the usual 8px spacing
// scale, so either the table's true height isn't exactly 471, or the gap
// token there isn't what this assumes.
const LIST_COLUMN_GAP = 21;
const DETAIL_COLUMN_GAP = 12;

const CARD_HEIGHTS = {
    documentsTable: 471,
    checklist: 120,
    vehicleInfo: 196,
    preview: 404
};

export function DocumentsTabLayout({ driverId }: DocumentsTabLayoutProps) {
    const { data, loading, error } = useQuery<GetDriverDocumentsData, GetDriverVars>(GET_DRIVER_DOCUMENTS, {
        variables: { driverId },
        skip: !driverId
    });

    const documentRows = flattenDriverDocuments(data?.getDriver?.documents ?? []);
    const [selectedDocumentId, setSelectedDocumentId] = useState<string>('');
    const activeDocumentId = selectedDocumentId || documentRows[0]?.id || '';
    const selectedDocument = documentRows.find((row) => row.id === activeDocumentId) ?? null;

    const [approveFile, { loading: approving }] = useMutation(APPROVE_DRIVER_DOCUMENT_FILE, {
        refetchQueries: ['GetDriverDocuments']
    });
    const [rejectFile, { loading: rejecting }] = useMutation(REJECT_DRIVER_DOCUMENT_FILE, {
        refetchQueries: ['GetDriverDocuments']
    });
    const docWiseStatus =
        data?.getDriver?.documents?.map((doc) => ({
            label: doc.type,
            verified: doc.status === 'APPROVED'
        })) || [];

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
    const vehicle = data?.getDriver?.vehicle;
    if (loading) {
        return <CircularProgress size={24} />;
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
            <Box sx={{ gridArea: 'list', display: 'flex', flexDirection: 'column', gap: `${LIST_COLUMN_GAP}px` }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4, height: CARD_HEIGHTS.documentsTable }}>
                        <CircularProgress size={24} />
                    </Box>
                ) : (
                    <KycDocumentsCard documents={documentRows} selectedDocumentId={activeDocumentId} onSelect={setSelectedDocumentId} />
                )}
                <VerificationChecklistCard docWiseStatus={docWiseStatus} />
            </Box>

            <Box sx={{ gridArea: 'detail', display: 'flex', flexDirection: 'column', gap: `${DETAIL_COLUMN_GAP}px` }}>
                <VehicleInformationCard vehicle={vehicle} />
                <DocumentPreviewCard
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
