// views/issues/issue.utils.ts
import { IssuePriority, IssueStatus, ReportedByType } from 'types/issues.types';

type ChipColor = 'primary' | 'secondary' | 'success' | 'orange' | 'error';

export const statusMeta: Record<IssueStatus, { label: string; color: ChipColor }> = {
    [IssueStatus.OPEN]: { label: 'Open', color: 'orange' },
    [IssueStatus.IN_REVIEW]: { label: 'In Progress', color: 'secondary' },
    [IssueStatus.RESOLVED]: { label: 'Resolved', color: 'success' }
};

export const priorityMeta: Record<IssuePriority, { label: string; color: ChipColor }> = {
    [IssuePriority.HIGH]: { label: 'High', color: 'error' },
    [IssuePriority.MEDIUM]: { label: 'Medium', color: 'orange' },
    [IssuePriority.LOW]: { label: 'Low', color: 'success' }
};

export function reportedByLabel(name: string, type: ReportedByType) {
    const prefix = type === ReportedByType.PASSENGER ? 'Passenger' : 'Driver';
    return `${prefix}: ${name}`;
}

export function formatTicketDate(iso: string) {
    const d = new Date(iso);
    const datePart = d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
    const timePart = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    return `${datePart} • ${timePart}`;
}
