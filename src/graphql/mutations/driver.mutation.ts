import { gql, TypedDocumentNode } from '@apollo/client';

export const DELETE_DRIVER = gql`
    mutation DeleteDriver($input: DeleteDriverInput!) {
        deleteDriver(input: $input)
    }
`;

export const BLOCK_DRIVER = gql`
    mutation BlockDriver($id: ID!) {
        blockDriver(id: $id) {
            id
            suspended
        }
    }
`;

export const UNBLOCK_DRIVER = gql`
    mutation UnblockDriver($id: ID!) {
        unblockDriver(id: $id) {
            id
            suspended
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
