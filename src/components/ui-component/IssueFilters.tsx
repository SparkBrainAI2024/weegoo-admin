// views/issues/IssueFilters.tsx
import * as React from 'react';

import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import MainCard from 'components/ui-component/cards/MainCard';

export interface IssueFilterValues {
    category: string;
    from: string;
    priority: string;
    /** 'All' | 'Unassigned' — see note in IssuesPage: no admin-user list query yet,
     * so filtering by a *specific* assignee isn't wired up. */
    assignee: string;
    dateFrom: string; // '' | 'YYYY-MM-DD'
    dateTo: string; // '' | 'YYYY-MM-DD'
}

interface IssueFiltersProps {
    values: IssueFilterValues;
    onChange: (values: IssueFilterValues) => void;
    categoryOptions: string[];
    selectedCount: number;
    onBulkResolve: () => void;
    bulkResolving?: boolean;
}

const ALL = 'All';

const FilterSelect = ({
    label,
    value,
    options,
    onChange
}: {
    label: string;
    value: string;
    options: string[];
    onChange: (value: string) => void;
}) => (
    <FormControl size="small" sx={{ minWidth: 160 }}>
        <Select
            value={value}
            onChange={(event: SelectChangeEvent) => onChange(event.target.value)}
            displayEmpty
            renderValue={(selected) => `${label}: ${selected}`}
            sx={{
                borderRadius: '8px',
                bgcolor: 'grey.50',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'grey.300' }
            }}
        >
            {[ALL, ...options].map((option) => (
                <MenuItem key={option} value={option}>
                    {option}
                </MenuItem>
            ))}
        </Select>
    </FormControl>
);

const IssueFilters = ({ values, onChange, categoryOptions, selectedCount, onBulkResolve, bulkResolving }: IssueFiltersProps) => {
    const setField = (field: keyof IssueFilterValues) => (value: string) => onChange({ ...values, [field]: value });

    return (
        <MainCard content={false} sx={{ p: 2 }}>
            <Stack spacing={1.5}>
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    alignItems={{ xs: 'stretch', sm: 'center' }}
                    justifyContent="space-between"
                    spacing={2}
                >
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} flexWrap="wrap">
                        <FilterSelect label="Category" value={values.category} options={categoryOptions} onChange={setField('category')} />
                        <FilterSelect label="From" value={values.from} options={['Passenger', 'Driver']} onChange={setField('from')} />
                        <FilterSelect
                            label="Priority"
                            value={values.priority}
                            options={['High', 'Medium', 'Low']}
                            onChange={setField('priority')}
                        />
                        {/* Only All / Unassigned until a getAdminUsers-style query exists to list real assignees */}
                        <FilterSelect label="Assignee" value={values.assignee} options={['Unassigned']} onChange={setField('assignee')} />

                        <TextField
                            label="From date"
                            type="date"
                            size="small"
                            value={values.dateFrom}
                            onChange={(e) => setField('dateFrom')(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            sx={{ minWidth: 160 }}
                        />
                        <TextField
                            label="To date"
                            type="date"
                            size="small"
                            value={values.dateTo}
                            onChange={(e) => setField('dateTo')(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            sx={{ minWidth: 160 }}
                        />
                    </Stack>

                    <Button
                        variant="contained"
                        disabled={selectedCount === 0 || bulkResolving}
                        onClick={onBulkResolve}
                        sx={{
                            borderRadius: '8px',
                            px: 3,
                            whiteSpace: 'nowrap',
                            bgcolor: 'grey.900',
                            color: 'common.white',
                            '&:hover': { bgcolor: 'grey.800' }
                        }}
                    >
                        {bulkResolving ? 'Resolving…' : `Bulk Resolve${selectedCount > 0 ? ` (${selectedCount})` : ''}`}
                    </Button>
                </Stack>
            </Stack>
        </MainCard>
    );
};

export default IssueFilters;
