// views/issues/IssueStatusTabs.tsx
// Same ToggleButtonGroup pattern as the driver list's status tabs, applied to
// issue status. Unlike the driver tabs, these don't show count chips on the
// buttons themselves — the stat cards row right below already shows Open/In
// Progress/Resolved counts, so repeating them here would be redundant. Easy to
// add later with the same Chip approach if you want them on the tabs too.

import * as React from 'react';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

// 'ALL' is a UI-only concept — it means "send no status filter at all" to the API.
// The other three match the real IssueStatus enum values exactly.
export type IssueStatusTab = 'ALL' | 'OPEN' | 'IN_REVIEW' | 'RESOLVED';

const TABS: { key: IssueStatusTab; label: string }[] = [
    { key: 'ALL', label: 'All' },
    { key: 'OPEN', label: 'Open' },
    { key: 'IN_REVIEW', label: 'In Progress' },
    { key: 'RESOLVED', label: 'Resolved' }
];

interface IssueStatusTabsProps {
    value: IssueStatusTab;
    onChange: (value: IssueStatusTab) => void;
}

const IssueStatusTabs = ({ value, onChange }: IssueStatusTabsProps) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleChange = (_event: React.MouseEvent<HTMLElement>, newValue: IssueStatusTab | null) => {
        // ToggleButtonGroup (exclusive) fires with null if you click the already-
        // selected button — ignore that so there's always exactly one tab active
        if (newValue !== null) onChange(newValue);
    };

    return (
        <ToggleButtonGroup
            exclusive
            value={value}
            onChange={handleChange}
            orientation={isMobile ? 'vertical' : 'horizontal'}
            fullWidth={isMobile}
            sx={{
                bgcolor: 'grey.100',
                borderRadius: '10px',
                p: 0.5,
                '& .MuiToggleButton-root': {
                    border: 'none',
                    borderRadius: '8px !important',
                    px: 2.5,
                    py: 0.75
                },
                '& .Mui-selected': {
                    bgcolor: '#000000 !important',
                    '&:hover': { bgcolor: 'grey.800 !important' }
                }
            }}
        >
            {TABS.map(({ key, label }) => (
                <ToggleButton key={key} value={key}>
                    <Typography
                        variant="subtitle2"
                        sx={{
                            fontSize: '13px',
                            fontWeight: 700,
                            color: value === key ? 'text.hint' : 'text.secondary'
                        }}
                    >
                        {label}
                    </Typography>
                </ToggleButton>
            ))}
        </ToggleButtonGroup>
    );
};

export default IssueStatusTabs;
