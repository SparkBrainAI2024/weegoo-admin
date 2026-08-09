// types/issues.types.ts
// Matches the backend's real enums/response shape (see issue.enum.ts / issue-list.response.ts).
// Superseded types/issue.types.ts's "Mock" enums now that we're wired to the real API —
// that file is left in place for local/offline dev, but components import from here.

export enum IssueStatus {
    OPEN = 'OPEN',
    IN_REVIEW = 'IN_REVIEW',
    RESOLVED = 'RESOLVED'
}

export enum ReportedByType {
    PASSENGER = 'PASSENGER',
    DRIVER = 'DRIVER'
}

export enum IssuePriority {
    HIGH = 'HIGH',
    MEDIUM = 'MEDIUM',
    LOW = 'LOW'
}

export interface IssueSummary {
    id: string;
    ticketCode: string;
    createdAt: string;
    reportedByName: string;
    reportedByType: ReportedByType;
    rideId?: string | null;
    categoryLabel?: string | null;
    status: IssueStatus;
    priority: IssuePriority;
    assigneeName?: string | null;
}
