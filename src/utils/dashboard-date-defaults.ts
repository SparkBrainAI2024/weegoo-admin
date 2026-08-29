// utils/dashboardDateDefaults.ts
import dayjs from 'dayjs';

// Used by Header (writes the picker's initial value) and StatsSection (reads it)
// so the two never drift apart. Not shared with individual chart components —
// those may define their own independent defaults.
export const DEFAULT_FROM_DATE = dayjs().subtract(6, 'day').format('YYYY-MM-DD');
export const DEFAULT_END_DATE = dayjs().format('YYYY-MM-DD');
