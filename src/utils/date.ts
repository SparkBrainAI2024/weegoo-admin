export const toDateTimeLocal = (iso: string): string => {
    if (!iso) return '';
    return iso.slice(0, 16); // "2026-05-28T17:26"
};
