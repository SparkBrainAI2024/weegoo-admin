// views/issues/IssueListTable.tsx
//
// Adapted from your existing OrderList.tsx pattern (sortable header, row select,
// pagination) but re-columned to match the Issues/Reports screenshot. Data currently
// comes from getMockIssues() — swap for a `useSelector`/GraphQL query later, the
// component doesn't care where `rows` comes from.

import * as React from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Typography from '@mui/material/Typography';
import { visuallyHidden } from '@mui/utils';

import Chip from 'components/ui-component/extended/Chip';
import MainCard from 'components/ui-component/cards/MainCard';

import { IssueRow } from '../../types/issues.types';
import { formatTicketDate, priorityMeta, reportedByLabel, statusMeta } from '../../utils/issue.utils';
import { IssueFilterValues } from './IssueFilters';

type Order = 'asc' | 'desc';
type SortableKey = 'ticketCode' | 'createdAt' | 'reportedByName' | 'categoryLabel' | 'priority' | 'status';

interface HeadCell {
    id: SortableKey;
    label: string;
    align: 'left' | 'right' | 'center';
}

// Order matches the screenshot exactly: Ticket, Date, From, Related Trip, Category,
// Priority, Status, Assignee, Action. "Related Trip" and "Assignee" aren't sortable
// (Related Trip is a foreign id, Assignee is mock-only) so they're rendered as plain
// cells interleaved with the sortable ones below, in HeadRow.
const headCells: HeadCell[] = [
    { id: 'ticketCode', label: 'Ticket', align: 'left' },
    { id: 'createdAt', label: 'Date', align: 'left' },
    { id: 'reportedByName', label: 'From', align: 'left' },
    { id: 'categoryLabel', label: 'Category', align: 'left' },
    { id: 'priority', label: 'Priority', align: 'center' },
    { id: 'status', label: 'Status', align: 'center' }
];

const sortableCell = (headCell: HeadCell, order: Order, orderBy: SortableKey, onSort: (id: SortableKey) => void) => (
    <TableCell key={headCell.id} align={headCell.align} sortDirection={orderBy === headCell.id ? order : false}>
        <TableSortLabel
            active={orderBy === headCell.id}
            direction={orderBy === headCell.id ? order : 'asc'}
            onClick={() => onSort(headCell.id)}
        >
            {headCell.label}
            {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
            ) : null}
        </TableSortLabel>
    </TableCell>
);

function descendingComparator(a: IssueRow, b: IssueRow, orderBy: SortableKey) {
    if (b[orderBy] < a[orderBy]) return -1;
    if (b[orderBy] > a[orderBy]) return 1;
    return 0;
}

function getComparator(order: Order, orderBy: SortableKey) {
    return order === 'desc'
        ? (a: IssueRow, b: IssueRow) => descendingComparator(a, b, orderBy)
        : (a: IssueRow, b: IssueRow) => -descendingComparator(a, b, orderBy);
}

function stableSort(array: IssueRow[], comparator: (a: IssueRow, b: IssueRow) => number) {
    const stabilized = array.map((el, index) => [el, index] as [IssueRow, number]);
    stabilized.sort((a, b) => {
        const cmp = comparator(a[0], b[0]);
        if (cmp !== 0) return cmp;
        return a[1] - b[1];
    });
    return stabilized.map((el) => el[0]);
}

function applyFilters(rows: IssueRow[], filters: IssueFilterValues) {
    return rows.filter((row) => {
        if (filters.category !== 'All' && row.categoryLabel !== filters.category) return false;
        if (filters.from !== 'All' && row.reportedByType !== filters.from.toUpperCase()) return false;
        if (filters.priority !== 'All' && priorityMeta[row.priority].label !== filters.priority) return false;
        if (filters.assignee !== 'All') {
            const assigneeLabel = row.assignee ?? 'Unassigned';
            if (assigneeLabel !== filters.assignee) return false;
        }
        return true;
    });
}

interface IssueListTableProps {
    rows: IssueRow[];
    filters: IssueFilterValues;
    selected: string[];
    onSelectedChange: (selected: string[]) => void;
}

const IssueListTable = ({ rows, filters, selected, onSelectedChange }: IssueListTableProps) => {
    const [order, setOrder] = React.useState<Order>('desc');
    const [orderBy, setOrderBy] = React.useState<SortableKey>('createdAt');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const filteredRows = React.useMemo(() => applyFilters(rows, filters), [rows, filters]);

    // Reset to page 1 whenever the filtered set changes so we never land on an empty page
    React.useEffect(() => setPage(0), [filters]);

    const handleRequestSort = (property: SortableKey) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        onSelectedChange(event.target.checked ? filteredRows.map((r) => r._id) : []);
    };

    const handleRowSelect = (id: string) => {
        const idx = selected.indexOf(id);
        if (idx === -1) onSelectedChange([...selected, id]);
        else onSelectedChange(selected.filter((s) => s !== id));
    };

    const isSelected = (id: string) => selected.includes(id);

    const paginatedRows = stableSort(filteredRows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    return (
        <MainCard content={false}>
            <TableContainer>
                <Table sx={{ minWidth: 900 }} aria-labelledby="issuesTableTitle">
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox" sx={{ pl: 3 }}>
                                <Checkbox
                                    color="primary"
                                    indeterminate={selected.length > 0 && selected.length < filteredRows.length}
                                    checked={filteredRows.length > 0 && selected.length === filteredRows.length}
                                    onChange={handleSelectAllClick}
                                    inputProps={{ 'aria-label': 'select all issues' }}
                                />
                            </TableCell>
                            {sortableCell(headCells[0], order, orderBy, handleRequestSort) /* Ticket */}
                            {sortableCell(headCells[1], order, orderBy, handleRequestSort) /* Date */}
                            {sortableCell(headCells[2], order, orderBy, handleRequestSort) /* From */}
                            <TableCell align="left">
                                <Typography variant="h5">Related Trip</Typography>
                            </TableCell>
                            {sortableCell(headCells[3], order, orderBy, handleRequestSort) /* Category */}
                            {sortableCell(headCells[4], order, orderBy, handleRequestSort) /* Priority */}
                            {sortableCell(headCells[5], order, orderBy, handleRequestSort) /* Status */}
                            <TableCell align="left">
                                <Typography variant="h5">Assignee</Typography>
                            </TableCell>
                            <TableCell align="center" sx={{ pr: 3 }}>
                                <Typography variant="h5">Action</Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {paginatedRows.map((row) => {
                            const isItemSelected = isSelected(row._id);
                            const status = statusMeta[row.status];
                            const priority = priorityMeta[row.priority];

                            return (
                                <TableRow
                                    hover
                                    role="checkbox"
                                    aria-checked={isItemSelected}
                                    tabIndex={-1}
                                    key={row._id}
                                    selected={isItemSelected}
                                >
                                    <TableCell padding="checkbox" sx={{ pl: 3 }} onClick={() => handleRowSelect(row._id)}>
                                        <Checkbox color="primary" checked={isItemSelected} />
                                    </TableCell>
                                    <TableCell onClick={() => handleRowSelect(row._id)} sx={{ cursor: 'pointer' }}>
                                        <Typography variant="h5">{row.ticketCode}</Typography>
                                    </TableCell>
                                    <TableCell>{formatTicketDate(row.createdAt)}</TableCell>
                                    <TableCell>{reportedByLabel(row.reportedByName, row.reportedByType)}</TableCell>
                                    <TableCell>{row.rideId}</TableCell>
                                    <TableCell>{row.categoryLabel}</TableCell>
                                    <TableCell align="center">
                                        <Chip label={priority.label} size="small" chipcolor={priority.color} />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Chip label={status.label} size="small" chipcolor={status.color} />
                                    </TableCell>
                                    <TableCell>{row.assignee ?? 'Unassigned'}</TableCell>
                                    <TableCell align="center" sx={{ pr: 3 }}>
                                        <Button size="small" variant="outlined" sx={{ borderRadius: '8px' }}>
                                            View
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                        {paginatedRows.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={10} align="center" sx={{ py: 6 }}>
                                    <Typography color="textSecondary">No issues match the current filters.</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                rowsPerPageOptions={[10, 25, 50]}
                component="div"
                count={filteredRows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(_e, newPage) => setPage(newPage)}
                onRowsPerPageChange={(e) => {
                    setRowsPerPage(parseInt(e.target.value, 10));
                    setPage(0);
                }}
            />
        </MainCard>
    );
};

export default IssueListTable;
