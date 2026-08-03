import React, { useMemo, useState } from 'react';
import { Box } from '@mui/material';
import KycDocumentsCard from './KYCDocumentsCard';
import VerificationChecklistCard from './verificationChecklistCard';
import VehicleInformationCard from './VehicleInformationCard';
import DocumentPreviewCard from './DocumentPreviewCard';
import { DriverDocument } from 'graphql/queries/drivers.queries';
import { flattenDriverDocuments } from 'utils/document.utils';

// ---------------------------------------------------------------------------
// STATIC MOCK DATA — shaped like the actual DriverDocument type: bundles,
// each with a nested files[]. This gets run through flattenDriverDocuments
// below, the same function the real GET_DRIVER_DOCUMENTS result will go
// through — so swapping this out for `data.getDriver.documents` later is a
// one-line change, not a reshape.
// ---------------------------------------------------------------------------
const MOCK_DOCUMENT_BUNDLES: DriverDocument[] = [
    {
        _id: 'doc_1',
        type: 'NATIONAL_ID',
        status: 'PENDING',
        rejectionReason: null,
        reviewedBy: null,
        reviewedAt: null,
        submittedAt: '2026-02-06T00:00:00.000Z',
        files: [
            {
                _id: 'file_1',
                side: 'FRONT',
                s3Key: 'https://mock-view-url/national-id-front.jpg',
                isActive: true,
                status: 'PENDING',
                downloadUrl: 'https://mock-download-url/national-id-front.jpg',
                verifiedBy: null,
                verifiedAt: null,
                createdAt: '2026-02-06T00:00:00.000Z'
            }
        ]
    },
    {
        _id: 'doc_2',
        type: 'DRIVER_LICENSE',
        status: 'PENDING',
        rejectionReason: null,
        reviewedBy: null,
        reviewedAt: null,
        submittedAt: '2026-02-05T00:00:00.000Z',
        files: [
            {
                _id: 'file_2',
                side: 'FRONT',
                s3Key: 'https://mock-view-url/driver-license-front.jpg',
                isActive: true,
                status: 'PENDING',
                downloadUrl: 'https://mock-download-url/driver-license-front.jpg',
                verifiedBy: null,
                verifiedAt: null,
                createdAt: '2026-02-05T00:00:00.000Z'
            }
        ]
    },
    {
        _id: 'doc_3',
        type: 'BLUEBOOK',
        status: 'REJECTED',
        rejectionReason: 'Front image is blurry, retake the photo',
        reviewedBy: 'admin_1',
        reviewedAt: '2026-02-04T12:00:00.000Z',
        submittedAt: '2026-02-04T00:00:00.000Z',
        files: [
            {
                _id: 'file_3',
                side: 'FRONT',
                s3Key: 'https://mock-view-url/bluebook-front.jpg',
                isActive: true,
                status: 'REJECTED',
                downloadUrl: 'https://mock-download-url/bluebook-front.jpg',
                verifiedBy: null,
                verifiedAt: null,
                createdAt: '2026-02-04T00:00:00.000Z'
            },
            {
                _id: 'file_4',
                side: 'BACK',
                s3Key: 'https://mock-view-url/bluebook-tax-info.jpg',
                isActive: true,
                status: 'REJECTED',
                downloadUrl: 'https://mock-download-url/bluebook-tax-info.jpg',
                verifiedBy: null,
                verifiedAt: null,
                createdAt: '2026-02-04T00:00:00.000Z'
            }
        ]
    }
];

export function DocumentsTabLayout() {
    const documentRows = useMemo(() => flattenDriverDocuments(MOCK_DOCUMENT_BUNDLES), []);

    const [selectedDocumentId, setSelectedDocumentId] = useState<string>(documentRows[0]?.id ?? '');
    const selectedDocument = documentRows.find((row) => row.id === selectedDocumentId) ?? null;

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
                <KycDocumentsCard
                    minHeight={320}
                    documents={documentRows}
                    selectedDocumentId={selectedDocumentId}
                    onSelect={setSelectedDocumentId}
                />
                <VerificationChecklistCard minHeight={140} />
            </Box>

            <Box sx={{ gridArea: 'detail', display: 'flex', flexDirection: 'column', gap: 3 }}>
                <VehicleInformationCard minHeight={140} />
                <DocumentPreviewCard minHeight={320} document={selectedDocument} />
            </Box>
        </Box>
    );
}

export default DocumentsTabLayout;
