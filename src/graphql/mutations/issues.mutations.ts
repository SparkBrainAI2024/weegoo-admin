// graphql/mutations/issue.mutation.ts
import { gql, TypedDocumentNode } from '@apollo/client';
import { IssueStatus } from 'types/issues.types';

export interface ResolveIssueData {
    resolveIssue: {
        message: string;
        id: string;
        status: IssueStatus;
    };
}
export interface ResolveIssueVars {
    id: string;
    resolvedBy: string;
}

export const RESOLVE_ISSUE: TypedDocumentNode<ResolveIssueData, ResolveIssueVars> = gql`
    mutation ResolveIssue($id: ID!, $resolvedBy: ID!) {
        resolveIssue(id: $id, resolvedBy: $resolvedBy) {
            message
            id
            status
        }
    }
`;

export interface BulkResolveIssuesData {
    bulkResolveIssues: {
        message: string;
        resolvedCount: number;
    };
}
export interface BulkResolveIssuesVars {
    ids: string[];
    resolvedBy: string;
}

export const BULK_RESOLVE_ISSUES: TypedDocumentNode<BulkResolveIssuesData, BulkResolveIssuesVars> = gql`
    mutation BulkResolveIssues($ids: [ID!]!, $resolvedBy: ID!) {
        bulkResolveIssues(ids: $ids, resolvedBy: $resolvedBy) {
            message
            resolvedCount
        }
    }
`;
