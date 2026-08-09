// graphql/issue.queries.ts
import { gql, TypedDocumentNode } from '@apollo/client';

import { IssueSummary } from 'types/issues.types';

export interface IssueListInput {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    category?: string;
    priority?: string;
    reportedByType?: string;
    unassignedOnly?: boolean;
    dateFrom?: string;
    dateTo?: string;
}

export interface IssuePagination {
    total: number;
    page: number;
    limit: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface GetIssuesQueryResult {
    getIssues: {
        items: IssueSummary[];
        pagination: IssuePagination;
        totalOpen: number;
        totalInReview: number;
        totalResolved: number;
        avgFirstResponse?: string | null;
        avgResolution?: string | null;
    };
}

export interface GetIssuesVars {
    input?: IssueListInput;
}

export const GET_ISSUES: TypedDocumentNode<GetIssuesQueryResult, GetIssuesVars> = gql`
    query GetIssues($input: IssueListInput) {
        getIssues(input: $input) {
            items {
                id
                ticketCode
                createdAt
                reportedByName
                reportedByType
                rideId
                categoryLabel
                status
                priority
                assigneeName
            }
            pagination {
                total
                page
                limit
                hasNextPage
                hasPreviousPage
            }
            totalOpen
            totalInReview
            totalResolved
            avgFirstResponse
            avgResolution
        }
    }
`;
