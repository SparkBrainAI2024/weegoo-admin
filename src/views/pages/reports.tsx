// views/issues/IssuesPage.tsx
import * as React from 'react';

import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';

import { useMutation, useQuery } from '@apollo/client/react';

import IssueStatCards from '../../components/ui-component/cards/IssueStatCards';
import IssueFilters, { IssueFilterValues } from 'components/ui-component/IssueFilters';
import { GET_ISSUES, IssueListInput } from 'graphql/queries/issues.queries';
import { useCurrentAdminId } from 'hooks/userCurrentAdminId';
import { BULK_RESOLVE_ISSUES } from 'graphql/mutations/issues.mutations';
import IssueListTable from 'components/ui-component/IssueListTable';

const DEFAULT_FILTERS: IssueFilterValues = {
    category: 'All',
    from: 'All',
    priority: 'All',
    assignee: 'All',
    dateFrom: '',
    dateTo: ''
};

// UI label -> API enum value. Kept next to the component so it's obvious what
// the filter dropdowns actually send.
const FROM_TO_REPORTED_TYPE: Record<string, string> = { Passenger: 'PASSENGER', Driver: 'DRIVER' };
const PRIORITY_TO_API: Record<string, string> = { High: 'HIGH', Medium: 'MEDIUM', Low: 'LOW' };

function buildQueryInput(filters: IssueFilterValues, page: number, limit: number): IssueListInput {
    return {
        page,
        limit,
        category: filters.category !== 'All' ? filters.category : undefined,
        reportedByType: filters.from !== 'All' ? FROM_TO_REPORTED_TYPE[filters.from] : undefined,
        priority: filters.priority !== 'All' ? PRIORITY_TO_API[filters.priority] : undefined,
        unassignedOnly: filters.assignee === 'Unassigned' ? true : undefined,
        dateFrom: filters.dateFrom || undefined,
        dateTo: filters.dateTo || undefined
    };
}

const IssuesPage = () => {
    const [filters, setFilters] = React.useState<IssueFilterValues>(DEFAULT_FILTERS);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [selected, setSelected] = React.useState<string[]>([]);
    const [snackbar, setSnackbar] = React.useState<{ message: string; severity: 'success' | 'error' } | null>(null);

    const currentAdminId = useCurrentAdminId();

    const { data, loading, error, refetch } = useQuery(GET_ISSUES, {
        variables: { input: buildQueryInput(filters, page, rowsPerPage) },
        notifyOnNetworkStatusChange: true
    });

    const [bulkResolveIssues, { loading: bulkResolving }] = useMutation(BULK_RESOLVE_ISSUES, {
        onCompleted: (res) => {
            setSelected([]);
            refetch();
            setSnackbar({ message: res.bulkResolveIssues.message, severity: 'success' });
        },
        onError: (err) => {
            console.error('bulkResolveIssues failed:', err.message);
            setSnackbar({ message: 'Failed to resolve selected issues', severity: 'error' });
        }
    });

    const handleFiltersChange = (next: IssueFilterValues) => {
        setFilters(next);
        setPage(0);
        setSelected([]); // selections don't carry across a re-filtered result set
    };

    const handleBulkResolve = () => {
        if (!currentAdminId) {
            setSnackbar({ message: 'No admin id available — cannot resolve issues yet', severity: 'error' });
            return;
        }
        bulkResolveIssues({ variables: { ids: selected, resolvedBy: currentAdminId } });
    };

    const items = data?.getIssues.items ?? [];
    const pagination = data?.getIssues.pagination;

    // Category options derived from what's currently loaded — there's no
    // dedicated category-list query yet, so this only reflects categories
    // present on the current page rather than the full set. Swap for a real
    // query once one exists.
    const categoryOptions = ['RIDE', 'COMPLAINT', 'CANCEL'];
    return (
        <Stack spacing={2.5}>
            {error && <Alert severity="error">Couldn&apos;t load issues: {error.message}</Alert>}

            <IssueStatCards
                totalOpen={data?.getIssues.totalOpen ?? 0}
                totalInReview={data?.getIssues.totalInReview ?? 0}
                totalResolved={data?.getIssues.totalResolved ?? 0}
                avgFirstResponse={data?.getIssues.avgFirstResponse}
                avgResolution={data?.getIssues.avgResolution}
                loading={loading && !data}
            />

            <IssueFilters
                values={filters}
                onChange={handleFiltersChange}
                categoryOptions={categoryOptions}
                selectedCount={selected.length}
                onBulkResolve={handleBulkResolve}
                bulkResolving={bulkResolving}
            />

            <Grid container>
                <Grid item xs={12}>
                    <IssueListTable
                        rows={items}
                        loading={loading}
                        selected={selected}
                        onSelectedChange={setSelected}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        total={pagination?.total ?? 0}
                        onPageChange={setPage}
                        onRowsPerPageChange={(newLimit) => {
                            setRowsPerPage(newLimit);
                            setPage(0);
                        }}
                    />
                </Grid>
            </Grid>

            <Snackbar open={!!snackbar} autoHideDuration={4000} onClose={() => setSnackbar(null)}>
                {snackbar ? (
                    <Alert severity={snackbar.severity} onClose={() => setSnackbar(null)}>
                        {snackbar.message}
                    </Alert>
                ) : undefined}
            </Snackbar>
        </Stack>
    );
};

export default IssuesPage;
