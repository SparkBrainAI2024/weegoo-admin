import { Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, useTheme } from '@mui/material';

// components/ui-component/DataTable.tsx

interface DataTableProps<T> {
    columns: Column<T>[];
    rows: T[];
    loading: boolean;
    getRowKey: (row: T) => string;
    onRowClick?: (row: T) => void;
    skeletonRows?: number;
}
export interface Column<T> {
    key: string;
    header: string;
    render: (row: T) => React.ReactNode;
    align?: 'left' | 'right' | 'center';
    width?: string;
}

export const DataTable = <T,>({ columns, rows, loading, getRowKey, onRowClick, skeletonRows = 10 }: DataTableProps<T>) => {
    const theme = useTheme();
    const contentBackground = theme.palette.background.default;
    return (
        <TableContainer sx={{ padding: 0 }}>
            {' '}
            <Table>
                <TableHead sx={{ backgroundColor: `${contentBackground}` }}>
                    <TableRow>
                        {columns.map((c) => (
                            <TableCell
                                key={c.key}
                                align={c.align}
                                sx={{ width: c.width, fontSize: 12, fontWeight: 400, color: '#2A2A2A', py: 1 }}
                            >
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
                                    <TableCell key={c.key} sx={{ width: c.width }}>
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
                                    <TableCell
                                        key={c.key}
                                        align={c.align}
                                        sx={{ width: c.width, fontSize: 12, fontWeight: 400, color: '#2A2A2A', py: 1 }}
                                    >
                                        {c.render(row)}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
