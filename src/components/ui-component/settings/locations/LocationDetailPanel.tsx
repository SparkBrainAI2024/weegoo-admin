import { useState } from 'react';
import { Avatar, Button, Paper, Skeleton, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useNavigate } from 'react-router';

import BusStationsTable from './BusStationsTable';
import DeleteLocationDialog from './DeleteLocationDialog';
import DeleteStationDialog from './DeleteStationDialog';
import { LocationDetail, SubLocation } from 'graphql/queries/locations.queries';
import { LOCATION_ROUTES } from '../constants/routes';

interface Props {
    location?: LocationDetail;
    loading: boolean;
}

export default function LocationDetailPanel({ location, loading }: Props) {
    const navigate = useNavigate();
    const [deleteLocationOpen, setDeleteLocationOpen] = useState(false);
    const [stationToDelete, setStationToDelete] = useState<SubLocation | null>(null);
    const noop = () => {};

    if (loading) {
        return (
            <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
                <Skeleton variant="text" width="30%" height={36} />
                <Skeleton variant="rounded" height={64} sx={{ my: 2 }} />
                <BusStationsTable stations={[]} loading onEdit={noop} onDelete={noop} />
            </Paper>
        );
    }

    if (!location) {
        return (
            <Paper variant="outlined" sx={{ p: 4, borderRadius: 3 }}>
                <Typography variant="body2" color="text.secondary" align="center">
                    Select a location to view its bus stations
                </Typography>
            </Paper>
        );
    }

    const count = location.subLocations.length;

    return (
        <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
            <Stack gap={3}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h4">{location.name}</Typography>
                    <Stack direction="row" gap={1}>
                        <Button
                            size="small"
                            variant="outlined"
                            color="inherit"
                            startIcon={<EditOutlinedIcon />}
                            onClick={() => navigate(LOCATION_ROUTES.edit(location._id))}
                        >
                            Edit
                        </Button>
                        <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            startIcon={<DeleteOutlineIcon />}
                            onClick={() => setDeleteLocationOpen(true)}
                        >
                            Delete
                        </Button>
                    </Stack>
                </Stack>

                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                    <Stack direction="row" alignItems="center" gap={2}>
                        <Avatar sx={{ bgcolor: 'success.light', color: 'success.dark' }}>
                            <LocationOnIcon fontSize="small" />
                        </Avatar>
                        <Stack>
                            <Typography variant="subtitle1">{location.name}</Typography>
                            <Typography variant="caption" color="text.secondary">
                                {count} bus stations
                            </Typography>
                        </Stack>
                    </Stack>
                </Paper>

                <Stack gap={1.5}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="h5">Bus Stations ({count})</Typography>
                        <Button
                            size="small"
                            variant="contained"
                            color="success"
                            startIcon={<AddIcon />}
                            onClick={() => navigate(LOCATION_ROUTES.newStation(location._id))}
                        >
                            Add Bus Station
                        </Button>
                    </Stack>

                    <BusStationsTable
                        stations={location.subLocations}
                        loading={false}
                        onEdit={(s) => navigate(LOCATION_ROUTES.editStation(location._id, s._id))}
                        onDelete={setStationToDelete}
                    />
                </Stack>
            </Stack>

            {deleteLocationOpen && (
                <DeleteLocationDialog
                    location={location}
                    onClose={() => setDeleteLocationOpen(false)}
                    onDeleted={() => navigate(LOCATION_ROUTES.list, { replace: true })}
                />
            )}
            {stationToDelete && (
                <DeleteStationDialog locationId={location._id} station={stationToDelete} onClose={() => setStationToDelete(null)} />
            )}
        </Paper>
    );
}
