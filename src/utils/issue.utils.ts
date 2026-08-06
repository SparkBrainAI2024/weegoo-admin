// views/issues/issue.utils.ts
import { IssuePriorityMock, IssueStatusMock, ReportedByTypeMock } from '../types/issues.types';

type ChipColor = 'primary' | 'secondary' | 'success' | 'orange' | 'error';

export const statusMeta: Record<IssueStatusMock, { label: string; color: ChipColor }> = {
    [IssueStatusMock.OPEN]: { label: 'Open', color: 'orange' },
    [IssueStatusMock.IN_PROGRESS]: { label: 'In Progress', color: 'secondary' },
    [IssueStatusMock.RESOLVED]: { label: 'Resolved', color: 'success' }
};

export const priorityMeta: Record<IssuePriorityMock, { label: string; color: ChipColor }> = {
    [IssuePriorityMock.HIGH]: { label: 'High', color: 'error' },
    [IssuePriorityMock.MEDIUM]: { label: 'Medium', color: 'orange' },
    [IssuePriorityMock.LOW]: { label: 'Low', color: 'success' }
};

export function reportedByLabel(name: string, type: ReportedByTypeMock) {
    const prefix = type === ReportedByTypeMock.RIDER ? 'Rider' : 'Driver';
    return `${prefix}: ${name}`;
}

export function formatTicketDate(iso: string) {
    const d = new Date(iso);
    const datePart = d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
    const timePart = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    return `${datePart} • ${timePart}`;
}
