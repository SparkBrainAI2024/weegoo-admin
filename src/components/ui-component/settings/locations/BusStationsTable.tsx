import { useMemo } from 'react';
import { Box, Chip, IconButton, Stack, Typography } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Column, DataTable } from 'components/ui-component/DataTable';
import { SubLocation } from 'graphql/queries/locations.queries';

type StationRow = SubLocation & { index: number };

interface Props {
    stations: SubLocation[];
    loading: boolean;
    onEdit: (station: SubLocation) => void;
    onDelete: (station: SubLocation) => void;
}

export default function BusStationsTable({ stations, loading, onEdit, onDelete }: Props) {
    const rows = useMemo<StationRow[]>(() => stations.map((s, i) => ({ ...s, index: i + 1 })), [stations]);

    const columns: Column<StationRow>[] = [
        { key: 'index', header: '#', width: '8%', render: (row) => row.index },
        { key: 'address', header: 'Bus Station Name', width: '32%', render: (row) => <Box fontWeight={600}>{row.address}</Box> },
        { key: 'latitude', header: 'Latitude', width: '15%', render: (row) => row.latitude },
        { key: 'longitude', header: 'Longitude', width: '15%', render: (row) => row.longitude },
        {
            key: 'status',
            header: 'Status',
            width: '15%',
            render: (row) => (
                <Chip
                    size="small"
                    label={row.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                    color={row.status === 'ACTIVE' ? 'success' : 'default'}
                    variant="outlined"
                    sx={{ fontSize: 11 }}
                />
            )
        },
        {
            key: 'actions',
            header: 'Actions',
            width: '15%',
            render: (row) => (
                <Stack direction="row" gap={0.5}>
                    <IconButton size="small" onClick={() => onEdit(row)}>
                        <EditOutlinedIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => onDelete(row)}>
                        <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                </Stack>
            )
        }
    ];

    return (
        <>
            <DataTable columns={columns} rows={rows} loading={loading} getRowKey={(row) => row._id} skeletonRows={5} />
            {!loading && rows.length === 0 && (
                <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
                    No bus stations added yet
                </Typography>
            )}
        </>
    );
}
