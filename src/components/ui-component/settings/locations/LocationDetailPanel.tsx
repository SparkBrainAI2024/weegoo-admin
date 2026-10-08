import { Avatar, Button, Paper, Skeleton, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusStationsTable from './BusStationsTable';
import { LocationDetail, SubLocation } from 'graphql/queries/locations.queries';
import { LOCATION_ROUTES } from '../constants/routes';
import { useNavigate } from 'react-router';
import DeleteLocationDialog from './DeleteLocationDialog';
import { useState } from 'react';

interface Props {
    location?: LocationDetail;
    loading: boolean;
}

export default function LocationDetailPanel({ location, loading }: Props) {
    // TODO: wire to dialogs + mutations
    const noop = () => {};
    const navigate = useNavigate();
    const [deleteLocationOpen, setDeleteLocationOpen] = useState(false);
    const [stationToDelete, setStationToDelete] = useState<SubLocation | null>(null);
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
        <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 3 }}>
            <Stack gap={1.5}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: '500'
                        }}
                    >
                        {location.name}
                    </Typography>
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
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                {location.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {count} bus stations
                            </Typography>
                        </Stack>
                    </Stack>
                </Paper>

                <Stack gap={1.5}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6" sx={{ fontWeight: '450' }}>
                            Bus Stations ({count})
                        </Typography>
                        <Button
                            size="small"
                            variant="contained"
                            color="success"
                            startIcon={<AddIcon />}
                            sx={{
                                fontSize: '0.75rem', // 13px
                                py: 0.5,
                                px: 1.5
                            }}
                            onClick={() => navigate(LOCATION_ROUTES.newStation(location._id))}
                        >
                            Add Bus Station
                        </Button>
                    </Stack>
                    <BusStationsTable stations={location.subLocations} loading={false} onEdit={noop} onDelete={noop} />
                </Stack>
            </Stack>
            {deleteLocationOpen && (
                <DeleteLocationDialog
                    location={location}
                    onClose={() => setDeleteLocationOpen(false)}
                    onDeleted={() => navigate(LOCATION_ROUTES.list, { replace: true })}
                />
            )}
        </Paper>
    );
}
