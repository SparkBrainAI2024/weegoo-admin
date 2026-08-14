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

export interface CloseIssueData {
    closeIssue: {
        message: string;
        id: string;
        status: IssueStatus;
    };
}
export interface CloseIssueVars {
    id: string;
    closedBy: string;
}

export const CLOSE_ISSUE: TypedDocumentNode<CloseIssueData, CloseIssueVars> = gql`
    mutation CloseIssue($id: ID!, $closedBy: ID!) {
        closeIssue(id: $id, closedBy: $closedBy) {
            message
            id
            status
        }
    }
`;

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
