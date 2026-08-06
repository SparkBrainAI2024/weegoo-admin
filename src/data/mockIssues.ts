// data/mockIssues.ts
// Stand-in for a `getIssues` GraphQL query. Swap `getMockIssues()` for a real
// `useQuery`/redux-thunk call later — the table only cares about `IssueRow[]`.

import { IssuePriorityMock, IssueRow, IssueStatusMock, ReportedByTypeMock } from 'types/issues.types';

const categories = ['Trip Issue', 'Payment', 'App Bug', 'Driver Behavior', 'Account', 'Fare Dispute'];
const riders = ['Sita Shrestha', 'Anirudh Gosain', 'Siya Gosain', 'Prakash Rai', 'Manisha Thapa'];
const drivers = ['Ramesh Singh', 'Bikash Karki', 'Sunil Magar', 'Deepak Shrestha'];
const assignees = ['Support Team', 'QA Team', 'Ops Team', undefined, undefined]; // undefined = "Unassigned"

function pick<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function randomTicket(index: number): IssueRow {
    const isRider = Math.random() > 0.4;
    const name = isRider ? pick(riders) : pick(drivers);
    const status = pick([IssueStatusMock.OPEN, IssueStatusMock.IN_PROGRESS, IssueStatusMock.RESOLVED]);
    const priority = pick([IssuePriorityMock.HIGH, IssuePriorityMock.MEDIUM, IssuePriorityMock.LOW]);

    const daysAgo = Math.floor(index / 8);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    date.setHours(8 + (index % 10), (index * 7) % 60);

    const idNum = 10500 - index * 3;

    return {
        _id: `mock-issue-${idNum}`,
        ticketCode: `REP-${idNum}`,
        createdAt: date.toISOString(),
        reportedByName: name,
        reportedByType: isRider ? ReportedByTypeMock.RIDER : ReportedByTypeMock.DRIVER,
        rideId: `T-${88000 + idNum}`,
        categoryLabel: pick(categories),
        status,
        priority,
        // Resolved tickets are always assigned; keep some open ones unassigned like the screenshot
        assignee: status === IssueStatusMock.RESOLVED ? pick(['Support Team', 'QA Team', 'Ops Team']) : pick(assignees)
    };
}

export function getMockIssues(count = 196): IssueRow[] {
    return Array.from({ length: count }, (_, i) => randomTicket(i));
}

export function getMockIssueStats(rows: IssueRow[]) {
    return {
        open: rows.filter((r) => r.status === IssueStatusMock.OPEN).length,
        inProgress: rows.filter((r) => r.status === IssueStatusMock.IN_PROGRESS).length,
        resolved: rows.filter((r) => r.status === IssueStatusMock.RESOLVED).length,
        avgFirstResponse: '12m',
        avgResolution: '30m'
    };
}
