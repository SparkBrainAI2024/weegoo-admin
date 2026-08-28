import { useState } from 'react';
import { Button, Popover, Stack, Box } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { IconCalendar, IconChevronDown } from '@tabler/icons-react';
import dayjs, { Dayjs } from 'dayjs';

export interface DateRangeValue {
    fromDate: Dayjs | null;
    endDate: Dayjs | null;
}

interface DateRangeFilterProps {
    value: DateRangeValue;
    onChange: (value: DateRangeValue) => void;
}

export function DateRangeFilter({ value, onChange }: DateRangeFilterProps) {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [draft, setDraft] = useState<DateRangeValue>(value);

    const open = Boolean(anchorEl);

    const label =
        value.fromDate && value.endDate
            ? `${value.fromDate.format('MMM D, YYYY')} - ${value.endDate.format('MMM D, YYYY')}`
            : 'Select date range';

    const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
        setDraft(value);
        setAnchorEl(e.currentTarget);
    };

    const handleClose = () => setAnchorEl(null);

    const handleApply = () => {
        onChange(draft);
        handleClose();
    };

    return (
        <>
            <Button
                onClick={handleOpen}
                variant="outlined"
                color="inherit"
                startIcon={<IconCalendar size={18} stroke={1.5} />}
                endIcon={<IconChevronDown size={16} stroke={1.5} />}
                sx={{ borderColor: 'divider', color: 'text.primary', fontWeight: 500, textTransform: 'none' }}
            >
                {label}
            </Button>

            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Box sx={{ p: 2 }}>
                    <Stack direction="row" spacing={2}>
                        <DatePicker
                            label="From"
                            value={draft.fromDate}
                            onChange={(newVal) => setDraft((d) => ({ ...d, fromDate: newVal }))}
                            maxDate={draft.endDate ?? undefined}
                        />
                        <DatePicker
                            label="To"
                            value={draft.endDate}
                            onChange={(newVal) => setDraft((d) => ({ ...d, endDate: newVal }))}
                            minDate={draft.fromDate ?? undefined}
                            maxDate={dayjs()}
                        />
                    </Stack>
                    <Stack direction="row" justifyContent="flex-end" spacing={1} mt={2}>
                        <Button size="small" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button size="small" variant="contained" onClick={handleApply} disabled={!draft.fromDate || !draft.endDate}>
                            Apply
                        </Button>
                    </Stack>
                </Box>
            </Popover>
        </>
    );
}
