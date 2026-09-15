import React, { useState } from 'react';
import { Box, Alert, Skeleton } from '@mui/material';
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
const DocumentsTabSkeleton = () => {
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
            {/* Left column */}
            <Box
                sx={{
                    gridArea: 'list',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: `${LIST_COLUMN_GAP}px`
                }}
            >
                {/* Documents table skeleton */}
                <Box
                    sx={{
                        height: CARD_HEIGHTS.documentsTable,
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 2,
                        p: 2
                    }}
                >
                    <Skeleton variant="text" width="35%" height={32} />

                    <Box sx={{ mt: 2 }}>
                        {[1, 2, 3, 4, 5, 6].map((item) => (
                            <Box
                                key={item}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    py: 1.5
                                }}
                            >
                                <Skeleton variant="rounded" width={42} height={42} />
                                <Box sx={{ flex: 1 }}>
                                    <Skeleton variant="text" width="55%" />
                                    <Skeleton variant="text" width="35%" />
                                </Box>
                                <Skeleton variant="rounded" width={70} height={24} />
                            </Box>
                        ))}
                    </Box>
                </Box>

                {/* Checklist skeleton */}
                <Box
                    sx={{
                        height: CARD_HEIGHTS.checklist,
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 2,
                        p: 2
                    }}
                >
                    <Skeleton variant="text" width="35%" height={28} />

                    <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                        <Skeleton variant="rounded" width={80} height={28} />
                        <Skeleton variant="rounded" width={80} height={28} />
                        <Skeleton variant="rounded" width={80} height={28} />
                    </Box>
                </Box>
            </Box>

            {/* Right column */}
            <Box
                sx={{
                    gridArea: 'detail',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: `${DETAIL_COLUMN_GAP}px`
                }}
            >
                {/* Vehicle skeleton */}
                <Box
                    sx={{
                        height: CARD_HEIGHTS.vehicleInfo,
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 2,
                        p: 2
                    }}
                >
                    <Skeleton variant="text" width="40%" height={30} />

                    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                        <Skeleton variant="rounded" width={100} height={100} />

                        <Box sx={{ flex: 1 }}>
                            <Skeleton variant="text" width="70%" />
                            <Skeleton variant="text" width="55%" />
                            <Skeleton variant="text" width="65%" />
                            <Skeleton variant="text" width="45%" />
                        </Box>
                    </Box>
                </Box>

                {/* Preview skeleton */}
                <Box
                    sx={{
                        height: CARD_HEIGHTS.preview,
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 2,
                        p: 2
                    }}
                >
                    <Skeleton variant="text" width="35%" height={30} />

                    <Skeleton
                        variant="rounded"
                        sx={{
                            width: '100%',
                            height: 280,
                            mt: 2
                        }}
                    />

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
                        <Skeleton variant="rounded" width={90} height={36} />
                        <Skeleton variant="rounded" width={90} height={36} />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
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
        return <DocumentsTabSkeleton />;
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
                <KycDocumentsCard documents={documentRows} selectedDocumentId={activeDocumentId} onSelect={setSelectedDocumentId} />

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
