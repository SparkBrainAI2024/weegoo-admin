// views/issues/IssuesPage.tsx
import * as React from 'react';

import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';

import { getMockIssues, getMockIssueStats } from 'data/mockIssues';
import IssueFilters, { IssueFilterValues } from 'components/ui-component/IssueFilters';
import IssueStatCards from 'components/ui-component/cards/IssueStatCards';
import IssueListTable from 'components/ui-component/IssueListTable';

const DEFAULT_FILTERS: IssueFilterValues = {
    category: 'All',
    from: 'All',
    priority: 'All',
    assignee: 'All'
};

const IssuesPage = () => {
    // Swap this for `useSelector((state) => state.issues)` + `dispatch(getIssues())`
    // once the GraphQL query exists — everything downstream just consumes `rows`.
    const [rows] = React.useState(() => getMockIssues());
    const [filters, setFilters] = React.useState<IssueFilterValues>(DEFAULT_FILTERS);
    const [selected, setSelected] = React.useState<string[]>([]);

    const stats = React.useMemo(() => getMockIssueStats(rows), [rows]);
    const categoryOptions = React.useMemo(() => Array.from(new Set(rows.map((r) => r.categoryLabel))).sort(), [rows]);
    const assigneeOptions = React.useMemo(() => Array.from(new Set(rows.map((r) => r.assignee ?? 'Unassigned'))).sort(), [rows]);

    const handleBulkResolve = () => {
        // TODO: fire a bulkResolveIssues mutation with `selected`, then refetch
        // eslint-disable-next-line no-console
        console.log('Bulk resolve', selected);
        setSelected([]);
    };

    return (
        <Stack spacing={2.5}>
            <IssueStatCards stats={stats} />

            <IssueFilters
                values={filters}
                onChange={setFilters}
                categoryOptions={categoryOptions}
                assigneeOptions={assigneeOptions}
                selectedCount={selected.length}
                onBulkResolve={handleBulkResolve}
            />

            <Grid container>
                <Grid item xs={12}>
                    <IssueListTable rows={rows} filters={filters} selected={selected} onSelectedChange={setSelected} />
                </Grid>
            </Grid>
        </Stack>
    );
};

export default IssuesPage;
