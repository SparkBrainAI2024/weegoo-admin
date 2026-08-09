// views/issues/IssueListTable.tsx
//
// Now presentational: filtering, sorting-by-date, and pagination all happen
// server-side via GET_ISSUES variables (see IssuesPage.tsx). This component just
// renders whatever page of rows it's given, and lets the header sort clicks
// re-order that page client-side (a small UX nicety — full server-side sort-by-
// field would need `orderBy`/`order` added to IssueListInput on the backend,
// noted as a TODO there).

import * as React from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import LinearProgress from '@mui/material/LinearProgress';
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

import { IssueSummary } from 'types/issues.types';
import { formatTicketDate, priorityMeta, reportedByLabel, statusMeta } from '../../utils/issue.utils';

type Order = 'asc' | 'desc';
type SortableKey = 'ticketCode' | 'createdAt' | 'reportedByName' | 'categoryLabel' | 'priority' | 'status';

interface HeadCell {
    id: SortableKey;
    label: string;
    align: 'left' | 'right' | 'center';
}

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

function descendingComparator(a: IssueSummary, b: IssueSummary, orderBy: SortableKey) {
    if ((b[orderBy] ?? '') < (a[orderBy] ?? '')) return -1;
    if ((b[orderBy] ?? '') > (a[orderBy] ?? '')) return 1;
    return 0;
}

interface IssueListTableProps {
    rows: IssueSummary[];
    loading: boolean;
    selected: string[];
    onSelectedChange: (selected: string[]) => void;
    page: number;
    rowsPerPage: number;
    total: number;
    onPageChange: (page: number) => void;
    onRowsPerPageChange: (rowsPerPage: number) => void;
}

const IssueListTable = ({
    rows,
    loading,
    selected,
    onSelectedChange,
    page,
    rowsPerPage,
    total,
    onPageChange,
    onRowsPerPageChange
}: IssueListTableProps) => {
    const [order, setOrder] = React.useState<Order>('desc');
    const [orderBy, setOrderBy] = React.useState<SortableKey>('createdAt');

    const handleRequestSort = (property: SortableKey) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        onSelectedChange(event.target.checked ? rows.map((r) => r.id) : []);
    };

    const handleRowSelect = (id: string) => {
        const idx = selected.indexOf(id);
        if (idx === -1) onSelectedChange([...selected, id]);
        else onSelectedChange(selected.filter((s) => s !== id));
    };

    const isSelected = (id: string) => selected.includes(id);

    // const sortedRows = React.useMemo(() => {
    //     const copy = [...rows];
    //     copy.sort((a, b) => (order === 'desc' ? descendingComparator(a, b, orderBy) : -descendingComparator(a, b, orderBy)));
    //     return copy;
    // }, [rows, order, orderBy]);

    return (
        <MainCard content={false}>
            {loading && <LinearProgress />}

            <TableContainer>
                <Table sx={{ minWidth: 900 }} aria-labelledby="issuesTableTitle">
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox" sx={{ pl: 3 }}>
                                <Checkbox
                                    color="primary"
                                    indeterminate={selected.length > 0 && selected.length < rows.length}
                                    checked={rows.length > 0 && selected.length === rows.length}
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
                        {rows.map((row) => {
                            const isItemSelected = isSelected(row.id);
                            const status = statusMeta[row.status];
                            const priority = priorityMeta[row.priority];
                            console.log(priority, 'priority');
                            console.log(status, 'status');

                            return (
                                <TableRow
                                    hover
                                    role="checkbox"
                                    aria-checked={isItemSelected}
                                    tabIndex={-1}
                                    key={row.id}
                                    selected={isItemSelected}
                                >
                                    <TableCell padding="checkbox" sx={{ pl: 3 }} onClick={() => handleRowSelect(row.id)}>
                                        <Checkbox color="primary" checked={isItemSelected} />
                                    </TableCell>
                                    <TableCell onClick={() => handleRowSelect(row.id)} sx={{ cursor: 'pointer' }}>
                                        <Typography variant="h5">{row.ticketCode}</Typography>
                                    </TableCell>
                                    <TableCell>{formatTicketDate(row.createdAt)}</TableCell>
                                    <TableCell>{reportedByLabel(row.reportedByName, row.reportedByType)}</TableCell>
                                    <TableCell>{row.rideId ?? '—'}</TableCell>
                                    <TableCell>{row.categoryLabel ?? '—'}</TableCell>
                                    {/* <TableCell align="center">
                                        <Chip label={priority.label} size="small" chipcolor={priority.color} />
                                    </TableCell>
                                     */}
                                    <TableCell align="center">
                                        <Chip
                                            label={row.priority ?? '—'}
                                            size="small"
                                            // chipcolor={priority.color}
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Chip label={status.label} size="small" chipcolor={status.color} />
                                    </TableCell>
                                    <TableCell>{row.assigneeName ?? 'Unassigned'}</TableCell>
                                    <TableCell align="center" sx={{ pr: 3 }}>
                                        <Button size="small" variant="outlined" sx={{ borderRadius: '8px' }}>
                                            View
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                        {!loading && rows.length === 0 && (
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
                count={total}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(_e, newPage) => onPageChange(newPage)}
                onRowsPerPageChange={(e) => onRowsPerPageChange(parseInt(e.target.value, 10))}
            />
        </MainCard>
    );
};

export default IssueListTable;
