// types/issue.types.ts
//
// This mirrors your real `Issue` entity (server/src/.../issue.entity.ts) as closely as
// possible. Two fields — `priority` and `assignee` — do NOT exist on the schema yet.
// They're marked MOCK-ONLY below. Once the backend adds them, delete the "mock-only"
// comments and wire them to the real GraphQL fields; nothing else needs to change.

// ---- Enums (mirrors ../enums/issue.enum on the server) --------------------
// NOTE: exact enum member names weren't in front of me, so these are best-guess
// labels based on the screenshot + your IssueStatus field. Swap for the real
// imported enum once you paste it over, the string values below are what the
// UI displays so keep them in sync with your server enum's actual values.

export enum IssueStatusMock {
    OPEN = 'OPEN',
    IN_PROGRESS = 'IN_PROGRESS',
    RESOLVED = 'RESOLVED'
}

export enum ReportedByTypeMock {
    RIDER = 'RIDER',
    DRIVER = 'DRIVER'
}

// MOCK-ONLY — not in the Issue schema yet
export enum IssuePriorityMock {
    HIGH = 'HIGH',
    MEDIUM = 'MEDIUM',
    LOW = 'LOW'
}

// ---- Row shape used by the table ------------------------------------------
export interface IssueRow {
    _id: string; // real: Issue._id
    ticketCode: string; // derived display value, e.g. "REP-10482" (from _id)
    createdAt: string; // real: Issue.createdAt
    reportedByName: string; // real: would come from populating Issue.reportedBy -> User.fullName
    reportedByType: ReportedByTypeMock; // real: Issue.reportedByType
    rideId?: string; // real: Issue.rideId
    categoryLabel: string; // real: Issue.category.label (IssueCategoryEmbed)
    status: IssueStatusMock; // real: Issue.status

    /** MOCK-ONLY — no `priority` field on Issue yet */
    priority: IssuePriorityMock;
    /** MOCK-ONLY — no `assignee` field on Issue yet */
    assignee?: string;
}

export interface IssueStats {
    open: number;
    inProgress: number;
    resolved: number;
    avgFirstResponse: string; // e.g. "12m"
    avgResolution: string; // e.g. "30m"
}
