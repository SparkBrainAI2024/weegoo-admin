import { gql, TypedDocumentNode } from '@apollo/client';

export const DELETE_DRIVER = gql`
    mutation DeleteDriver($input: DeleteDriverInput!) {
        deleteDriver(input: $input) {
            deleted
            message
        }
    }
`;

export const BLOCK_DRIVER = gql`
    mutation BlockDriver($id: ID!) {
        blockDriver(id: $id) {
            id
            suspended
            message
        }
    }
`;

export const UNBLOCK_DRIVER = gql`
    mutation UnblockDriver($id: ID!) {
        unblockDriver(id: $id) {
            id
            suspended
            message
        }
    }
`;

// graphql/driver.queries.ts

export interface ReviewDocumentData {
    reviewDocument: {
        _id: string;
        status: string;
        rejectionReason: string | null;
        reviewedAt: string | null;
        reviewedBy: string | null;
    };
}

export interface ReviewDocumentVars {
    documentId: string;
    status: 'APPROVED' | 'REJECTED';
    rejectionReason?: string;
}

export const REVIEW_DOCUMENT: TypedDocumentNode<ReviewDocumentData, ReviewDocumentVars> = gql`
    mutation ReviewDocument($documentId: ID!, $status: DocumentStatus!, $rejectionReason: String) {
        reviewDocument(documentId: $documentId, status: $status, rejectionReason: $rejectionReason) {
            _id
            status
            rejectionReason
            reviewedAt
            reviewedBy
        }
    }
`;

export const APPROVE_DRIVER_DOCUMENT_FILE = gql`
    mutation ApproveDriverDocumentFile($input: ApproveDocumentFileInput!) {
        approveDriverDocumentFile(input: $input) {
            _id
            status
            files {
                _id
                status
                verifiedBy
                verifiedAt
            }
        }
    }
`;

export const REJECT_DRIVER_DOCUMENT_FILE = gql`
    mutation RejectDriverDocumentFile($input: RejectDocumentFileInput!) {
        rejectDriverDocumentFile(input: $input) {
            _id
            status
            rejectionReason
            files {
                _id
                status
                verifiedBy
                verifiedAt
            }
        }
    }
`;
