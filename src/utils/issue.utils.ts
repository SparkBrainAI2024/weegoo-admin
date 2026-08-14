// views/issues/issue.utils.ts
import { IssuePriority, IssueStatus, ReportedByType } from 'types/issues.types';

type ChipColor = 'primary' | 'secondary' | 'success' | 'orange' | 'error';

export const statusMeta: Record<IssueStatus, { label: string; color: ChipColor }> = {
    [IssueStatus.OPEN]: { label: 'Open', color: 'orange' },
    [IssueStatus.IN_REVIEW]: { label: 'In Progress', color: 'secondary' },
    [IssueStatus.RESOLVED]: { label: 'Resolved', color: 'success' },
    [IssueStatus.CLOSED]: { label: 'Closed', color: 'success' }
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

// views/issues/detail/issueDetail.utils.ts

export function getInitials(fullName: string): string {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
}

// "+977 9812345612" -> "+977 98XXXXXX12" — keeps country code + first 2 + last 2
// digits of the subscriber number, masks the middle. Purely a display helper;
// the real unmasked number should never be sent to the client if you don't
// already need it for something else on this page.
export function maskPhone(phone: string): string {
    const match = phone.match(/^(\+\d+)\s*(\d+)$/);
    if (!match) return phone;
    const [, countryCode, digits] = match;
    if (digits.length <= 4) return `${countryCode} ${digits}`;
    const visible = 2;
    const masked = 'X'.repeat(digits.length - visible * 2);
    return `${countryCode} ${digits.slice(0, visible)}${masked}${digits.slice(-visible)}`;
}

// Deterministic-ish avatar color from a name, so the same person always gets
// the same color without needing a stored value.
const AVATAR_COLORS = ['#4CAF50', '#FF9800', '#2196F3', '#9C27B0', '#F44336', '#00BCD4'];
export function avatarColorFor(seed: string): string {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}
