import { Alert, Button, FormControlLabel, IconButton, Paper, Skeleton, Stack, Switch, TextField, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useFormik } from 'formik';
import { useNavigate, useParams } from 'react-router';
import { Link as RouterLink } from 'react-router-dom';
import useNotification from 'hooks/useNotification';

import { useCreateLocation } from 'hooks/useCreateLocation';
import { useUpdateLocation } from 'hooks/useUpdateLocation';
import BusStationsTable from './BusStationsTable';
import { useLocationDetail } from 'hooks/useLocationDetail';
import { LOCATION_ROUTES } from '../constants/routes';
import { LocationStatus, SubLocation } from 'graphql/queries/locations.queries';
import { useState } from 'react'; // if not already imported
import DeleteStationDialog from './DeleteStationDialog';

interface FormValues {
    name: string;
    isActive: boolean;
}

export default function LocationFormPage() {
    const { locationId } = useParams();
    const isEdit = Boolean(locationId);
    const navigate = useNavigate();
    const { showSuccess, showError } = useNotification();
    const [stationToDelete, setStationToDelete] = useState<SubLocation | null>(null);

    const { location, loading } = useLocationDetail(locationId ?? null);
    const { createLocation } = useCreateLocation();
    const { updateLocation } = useUpdateLocation();

    // back to the list with this location pre-selected
    const backTo = locationId ? `${LOCATION_ROUTES.list}?locationId=${locationId}` : LOCATION_ROUTES.list;

    const formik = useFormik<FormValues>({
        enableReinitialize: true, // prefill once the query resolves; also re-baselines `dirty` after a save
        initialValues: { name: location?.name ?? '', isActive: location ? location.status === 'ACTIVE' : true },
        validate: (v) => (v.name.trim() ? {} : { name: 'Location name is required' }),
        onSubmit: async (v) => {
            const input = { name: v.name.trim(), status: (v.isActive ? 'ACTIVE' : 'INACTIVE') as LocationStatus };
            try {
                if (locationId) {
                    await updateLocation(locationId, input);
                    showSuccess('Location updated successfully');
                } else {
                    const created = await createLocation(input);
                    showSuccess('Location created successfully');
                    if (created) navigate(LOCATION_ROUTES.edit(created._id), { replace: true });
                }
            } catch (err) {
                console.error(err);
                showError(isEdit ? 'Failed to update location' : 'Failed to create location');
            }
        }
    });

    if (isEdit && loading && !location) {
        return (
            <Stack gap={3} p={3}>
                <Skeleton variant="rounded" height={40} width={320} />
                <Skeleton variant="rounded" height={220} />
                <Skeleton variant="rounded" height={260} />
            </Stack>
        );
    }

    if (isEdit && !loading && !location) {
        return (
            <Stack gap={2} p={3} alignItems="flex-start">
                <Alert severity="error">We couldn&apos;t find this location.</Alert>
                <Button component={RouterLink} to={LOCATION_ROUTES.list}>
                    Back to locations
                </Button>
            </Stack>
        );
    }

    return (
        <Stack gap={3} p={3}>
            <Stack direction="row" gap={1.5} alignItems="flex-start">
                <IconButton onClick={() => navigate(backTo)} aria-label="Back to locations">
                    <ArrowBackIcon />
                </IconButton>
                <Stack gap={0.5} maxWidth={560}>
                    <Typography variant="h4">{isEdit ? 'Edit Location' : 'Add Location'}</Typography>
                    <Typography variant="body2" color="text.secondary">
                        {isEdit
                            ? 'Update this location and manage its bus stations.'
                            : 'Add a new location. You can add its bus stations right after saving.'}
                    </Typography>
                </Stack>
            </Stack>

            <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
                <form onSubmit={formik.handleSubmit}>
                    <Stack gap={2.5}>
                        <Typography variant="h5">Location Details</Typography>

                        <TextField
                            name="name"
                            label="Location Name *"
                            size="small"
                            sx={{ maxWidth: 420 }}
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.name && !!formik.errors.name}
                            helperText={formik.touched.name && formik.errors.name}
                        />

                        <Stack gap={0.5}>
                            <Typography variant="subtitle2">Status</Typography>
                            <FormControlLabel
                                control={
                                    <Switch
                                        color="success"
                                        checked={formik.values.isActive}
                                        onChange={(_, checked) => formik.setFieldValue('isActive', checked)}
                                    />
                                }
                                label={formik.values.isActive ? 'Active' : 'Inactive'}
                            />
                            <Typography variant="caption" color="text.secondary">
                                This location will be available for booking and driver availability.
                            </Typography>
                        </Stack>

                        <Stack direction="row" justifyContent="flex-end" gap={1.5}>
                            <Button variant="outlined" color="inherit" onClick={() => navigate(backTo)} disabled={formik.isSubmitting}>
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                color="success"
                                disabled={formik.isSubmitting || (isEdit && !formik.dirty)}
                            >
                                {isEdit ? 'Save Changes' : 'Save Location'}
                            </Button>
                        </Stack>
                    </Stack>
                </form>
            </Paper>

            {location && (
                <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
                    <Stack gap={2}>
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={2}>
                            <Stack gap={0.5}>
                                <Typography variant="h5">Bus Stations ({location.subLocations.length})</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    These are used as pickup/drop-off points for this location.
                                </Typography>
                            </Stack>
                            <Button
                                variant="outlined"
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

                        <Alert severity="success" icon={false} sx={{ fontSize: 12 }}>
                            You can add multiple bus stations for this location. Drivers will be able to set their availability for these
                            stations, and customers can book rides using the same locations in the mobile app.
                        </Alert>
                    </Stack>
                    {stationToDelete && location && (
                        <DeleteStationDialog locationId={location._id} station={stationToDelete} onClose={() => setStationToDelete(null)} />
                    )}
                </Paper>
            )}
        </Stack>
    );
}
