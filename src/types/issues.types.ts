// types/issues.types.ts
// Matches the backend's real enums/response shape (see issue.enum.ts / issue-list.response.ts).
// Superseded types/issue.types.ts's "Mock" enums now that we're wired to the real API —
// that file is left in place for local/offline dev, but components import from here.

export enum IssueStatus {
    OPEN = 'OPEN',
    IN_REVIEW = 'IN_REVIEW',
    RESOLVED = 'RESOLVED',
    CLOSED = 'CLOSED'
}

export enum ReportedByType {
    PASSENGER = 'PASSENGER',
    DRIVER = 'DRIVER',
    ADMIN = 'ADMIN'
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

export interface IssuePartyInfo {
    role: 'PASSENGER' | 'DRIVER' | 'ADMIN';
    fullName: string;
    phone: string;
    displayId: string; // "RID-22041" / "DRV-11002" — from passengerSlugId/driverSlugId
    userId: string;
    suspended: boolean;
    profileImage: string;
}

export interface IssueDetail {
    _id: string;
    ticketCode: string | null;
    status: IssueStatus;
    priority: IssuePriority;
    categoryLabel: string; // now just category.parentCategory, per the repo change
    createdAt: string;
    rideId?: string | null;
    description: string;
    reporter: IssuePartyInfo;
    // null when there's no related ride (e.g. a general platform complaint)
    reportee?: IssuePartyInfo | null;
}
