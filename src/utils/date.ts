export const toDateTimeLocal = (iso: string): string => {
    if (!iso) return '';
    return iso.slice(0, 16); // "2026-05-28T17:26"
};

export const formatNepalTime = (date: string | null) => {
    if (!date) return '—';

    return new Intl.DateTimeFormat('en-NP', {
        timeZone: 'Asia/Kathmandu',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    }).format(new Date(date));
};
