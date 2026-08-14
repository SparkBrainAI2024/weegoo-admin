// graphql/issue.queries.ts
import { gql, TypedDocumentNode } from '@apollo/client';

import { IssueSummary } from 'types/issues.types';

// graphql/issueDetail.queries.ts
import { IssuePriority, IssueStatus, ReportedByType } from 'types/issues.types';

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

export interface IssuePartyDetailData {
    role: ReportedByType;
    fullName: string;
    phone?: string | null;
    displayId?: string | null;
    userId: string;
    suspended: boolean;
}

export interface GetIssueDetailData {
    getIssueDetail: {
        id: string;
        ticketCode: string;
        status: IssueStatus;
        priority: IssuePriority;
        categoryLabel?: string | null;
        createdAt: string;
        description: string;
        reportedFrom: IssuePartyDetailData;
        reportedTo?: IssuePartyDetailData | null;
    };
}

export interface GetIssueDetailVars {
    input: {
        id: string;
    };
}
export const GET_ISSUE_DETAIL: TypedDocumentNode<GetIssueDetailData, GetIssueDetailVars> = gql`
    query GetIssueDetail($input: IssueDetailInput!) {
        getIssueDetail(input: $input) {
            _id
            status
            priority

            createdAt
            issueContent

            __typename
        }
    }
`;

// reportedTo {
//     role
//     fullName
//     phone
//     displayId
//     userId
//     suspended
//     __typename
// }
// ticketCode
// categoryLabel
// reportedFrom {
//             role
//             fullName
//             phone
//             displayId
//             userId
//             suspended
//             __typename
//         }
