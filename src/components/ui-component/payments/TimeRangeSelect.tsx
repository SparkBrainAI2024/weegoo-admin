import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { TimeRangeFilter } from 'types/enum';

const OPTIONS: { value: TimeRangeFilter; label: string }[] = [
    { value: TimeRangeFilter.LAST_7_DAYS, label: 'Last 7 Days' },
    { value: TimeRangeFilter.LAST_30_DAYS, label: 'Last 30 Days' },
    { value: TimeRangeFilter.LAST_6_MONTHS, label: 'Last 6 Months' },
    { value: TimeRangeFilter.THIS_YEAR, label: 'This Year' }
];

export default function TimeRangeSelect({ value, onChange }: { value: TimeRangeFilter; onChange: (value: TimeRangeFilter) => void }) {
    return (
        <Select
            sx={{
                height: 24,
                fontSize: '13px',
                '& .MuiSelect-select': {
                    padding: '2px 28px 2px 8px',
                    display: 'flex',
                    alignItems: 'center'
                }
            }}
            value={value}
            onChange={(e: SelectChangeEvent) => onChange(e.target.value as TimeRangeFilter)}
        >
            {OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                </MenuItem>
            ))}
        </Select>
    );
}
