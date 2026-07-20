import { Skeleton, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

// components/ui-component/DataTable.tsx
export interface Column<T> {
    key: string;
    header: string;
    render: (row: T) => React.ReactNode;
    align?: 'left' | 'right' | 'center';
}

interface DataTableProps<T> {
    columns: Column<T>[];
    rows: T[];
    loading: boolean;
    getRowKey: (row: T) => string;
    onRowClick?: (row: T) => void;
    skeletonRows?: number;
}

export const DataTable = <T,>({ columns, rows, loading, getRowKey, onRowClick, skeletonRows = 10 }: DataTableProps<T>) => {
    return (
        <Table>
            <TableHead>
                <TableRow>
                    {columns.map((c) => (
                        <TableCell key={c.key} align={c.align} sx={{ fontSize: 12, fontWeight: 400, color: '#2A2A2A', py: 1 }}>
                            {c.header}
                        </TableCell>
                    ))}
                </TableRow>
            </TableHead>
            <TableBody>
                {loading &&
                    Array.from({ length: skeletonRows }).map((_, i) => (
                        <TableRow key={i}>
                            {columns.map((c) => (
                                <TableCell
                                    sx={{
                                        '& .MuiTableCell-root': { fontSize: 12, py: 1, fontWeight: 400, color: '#2A2A2A' },
                                        '& .MuiTableCell-head': { fontSize: 11, fontWeight: 400, color: '#6F6F6E' }
                                    }}
                                    key={c.key}
                                >
                                    <Skeleton variant="text" />
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                {!loading &&
                    rows.map((row) => (
                        <TableRow
                            key={getRowKey(row)}
                            hover={!!onRowClick}
                            onClick={() => onRowClick?.(row)}
                            sx={{ cursor: onRowClick ? 'pointer' : 'default' }}
                        >
                            {columns.map((c) => (
                                <TableCell key={c.key} align={c.align}>
                                    {c.render(row)}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
            </TableBody>
        </Table>
    );
};
