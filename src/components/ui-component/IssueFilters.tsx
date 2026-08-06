// views/issues/IssueFilters.tsx
import * as React from 'react';

import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Stack from '@mui/material/Stack';

import MainCard from 'components/ui-component/cards/MainCard';

export interface IssueFilterValues {
    category: string;
    from: string;
    priority: string;
    assignee: string;
}

interface IssueFiltersProps {
    values: IssueFilterValues;
    onChange: (values: IssueFilterValues) => void;
    categoryOptions: string[];
    assigneeOptions: string[];
    selectedCount: number;
    onBulkResolve: () => void;
}

const ALL = 'All';

// One small helper so every dropdown gets the same "Label: Value" look from the mock
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

const IssueFilters = ({ values, onChange, categoryOptions, assigneeOptions, selectedCount, onBulkResolve }: IssueFiltersProps) => {
    const setField = (field: keyof IssueFilterValues) => (value: string) => onChange({ ...values, [field]: value });

    return (
        <MainCard content={false} sx={{ p: 2 }}>
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                alignItems={{ xs: 'stretch', sm: 'center' }}
                justifyContent="space-between"
                spacing={2}
            >
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} flexWrap="wrap">
                    <FilterSelect label="Category" value={values.category} options={categoryOptions} onChange={setField('category')} />
                    <FilterSelect label="From" value={values.from} options={['Rider', 'Driver']} onChange={setField('from')} />
                    <FilterSelect
                        label="Priority"
                        value={values.priority}
                        options={['High', 'Medium', 'Low']}
                        onChange={setField('priority')}
                    />
                    <FilterSelect label="Assignee" value={values.assignee} options={assigneeOptions} onChange={setField('assignee')} />
                </Stack>

                <Button
                    variant="contained"
                    disabled={selectedCount === 0}
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
                    Bulk Resolve{selectedCount > 0 ? ` (${selectedCount})` : ''}
                </Button>
            </Stack>
        </MainCard>
    );
};

export default IssueFilters;
