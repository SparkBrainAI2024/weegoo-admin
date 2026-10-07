import { useEffect, useRef, useState } from 'react';
import {
    Alert,
    alpha,
    Autocomplete,
    Box,
    Button,
    CircularProgress,
    Divider,
    FormControlLabel,
    IconButton,
    InputAdornment,
    Paper,
    Skeleton,
    Stack,
    Switch,
    TextField,
    Typography
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import { useNavigate, useParams } from 'react-router';
import useNotification from 'hooks/useNotification';
import { useDebounce } from 'hooks/useDebounce';
import { useLocationDetail } from 'hooks/useLocationDetail';
import { useCreateSubLocation, useUpdateSubLocation } from 'hooks/useSublocationMutation';
import { useBaatoSearch } from 'hooks/useBaatoSearch';
import { LOCATION_ROUTES } from '../constants/routes';
import { Place, PlaceSuggestion, getPlaceDetails } from 'api/baato';

export default function StationFormPage() {
    const { locationId = '', stationId } = useParams();
    const isEdit = Boolean(stationId);
    const navigate = useNavigate();

    const [resolving, setResolving] = useState(false);
    const requestId = useRef(0);
    const { showSuccess, showError } = useNotification();

    const { location, loading } = useLocationDetail(isEdit ? locationId : null);
    const station = location?.subLocations.find((s) => s._id === stationId);
    const createSubLocation = useCreateSubLocation();
    const updateSubLocation = useUpdateSubLocation();

    const [input, setInput] = useState('');
    const debounced = useDebounce(input, 400);
    const { results, loading: searching, error: searchError } = useBaatoSearch(debounced);

    const [selected, setSelected] = useState<Place | null>(null);
    const [isActive, setIsActive] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // edit mode: prefill from the saved station
    useEffect(() => {
        if (!station) return;
        setSelected({ id: station._id, name: station.address, latitude: station.latitude, longitude: station.longitude, source: 'Saved' });
        setIsActive(station.status === 'ACTIVE');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [station?._id]);

    const backToLocation = () => navigate(LOCATION_ROUTES.edit(locationId));
    const dirty = isEdit ? selected?.id !== stationId : true;

    const handleSave = async () => {
        if (!selected) return;
        setSubmitting(true);
        try {
            const coords = { address: selected.name, latitude: selected.latitude, longitude: selected.longitude };
            if (stationId) {
                await updateSubLocation(locationId, stationId, coords);
            } else {
                await createSubLocation(locationId, { ...coords, status: isActive ? 'ACTIVE' : 'INACTIVE' });
            }
            showSuccess(isEdit ? 'Bus station updated successfully' : 'Bus station added successfully');
            backToLocation();
        } catch (err) {
            console.error(err);
            showError(isEdit ? 'Failed to update bus station' : 'Failed to add bus station');
            setSubmitting(false);
        }
    };
    const handleSelect = async (suggestion: PlaceSuggestion) => {
        const id = ++requestId.current;
        setResolving(true);
        try {
            const place = await getPlaceDetails(suggestion.id);
            if (id === requestId.current) setSelected(place); // ignore a slow earlier pick
        } catch (err) {
            console.error(err);
            showError('Could not load bus station details. Please try again.');
        } finally {
            if (id === requestId.current) setResolving(false);
        }
    };

    if (isEdit && loading && !location) {
        return (
            <Stack gap={3} p={3}>
                <Skeleton variant="rounded" height={40} width={320} />
                <Skeleton variant="rounded" height={56} />
                <Skeleton variant="rounded" height={180} />
            </Stack>
        );
    }

    if (isEdit && !station) {
        return (
            <Stack gap={2} p={3} alignItems="flex-start">
                <Alert severity="error">We couldn&apos;t find this bus station.</Alert>
                <Button onClick={backToLocation}>Back to location</Button>
            </Stack>
        );
    }

    return (
        <Stack gap={3} p={3}>
            <Stack direction="row" gap={1.5} alignItems="flex-start">
                <IconButton onClick={backToLocation} aria-label="Back to location">
                    <ArrowBackIcon />
                </IconButton>
                <Stack gap={0.5}>
                    <Typography variant="h4">{isEdit ? 'Edit Bus Station' : 'Add Bus Station'}</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Search and select a bus station using Baato location search. The location details will be fetched automatically.
                    </Typography>
                </Stack>
            </Stack>

            <Autocomplete
                options={results}
                loading={searching}
                value={null} // selection lives in the card below; the box stays a pure search field
                inputValue={input}
                onInputChange={(_, v) => setInput(v)}
                onChange={(_, suggestion) => suggestion && handleSelect(suggestion)}
                filterOptions={(x) => x} // Baato already filtered
                getOptionLabel={(o) => o.name}
                isOptionEqualToValue={(a, b) => a.id === b.id}
                noOptionsText={
                    input.trim().length < 2
                        ? 'Type at least 2 characters'
                        : searchError
                          ? 'Search failed, try again'
                          : 'No bus stations found'
                }
                renderOption={(props, option) => (
                    <li {...props} key={option.id}>
                        <Stack direction="row" gap={1.5} alignItems="center">
                            <LocationOnOutlinedIcon color="action" />
                            <Stack>
                                <Typography variant="subtitle2">{option.name}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {option.address}
                                </Typography>
                            </Stack>
                        </Stack>
                    </li>
                )}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Search Bus Station *"
                        placeholder="Search bus station (e.g. Ratnapark, New Bus Park...)"
                        InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon fontSize="small" color="disabled" />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <>
                                    {searching && <CircularProgress size={16} />}
                                    {params.InputProps.endAdornment}
                                </>
                            )
                        }}
                    />
                )}
            />

            {resolving ? (
                <Skeleton variant="rounded" height={160} />
            ) : (
                selected && (
                    <Paper
                        variant="outlined"
                        sx={(t) => ({
                            p: 2.5,
                            borderRadius: 3,
                            bgcolor: alpha(t.palette.success.main, 0.06),
                            borderColor: alpha(t.palette.success.main, 0.3)
                        })}
                    >
                        <Stack gap={2}>
                            <Stack direction="row" gap={1.5} alignItems="flex-start">
                                <LocationOnOutlinedIcon color="success" />
                                <Stack>
                                    <Typography variant="caption" color="text.secondary">
                                        Selected Bus Station
                                    </Typography>
                                    <Typography variant="h5">{selected.name}</Typography>
                                    {selected.address && (
                                        <Typography variant="caption" color="text.secondary">
                                            {selected.address}
                                        </Typography>
                                    )}
                                </Stack>
                            </Stack>
                            <Divider />
                            <Stack direction="row" gap={4} flexWrap="wrap">
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Latitude
                                    </Typography>
                                    <Typography variant="subtitle2">{selected.latitude.toFixed(4)}</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Longitude
                                    </Typography>
                                    <Typography variant="subtitle2">{selected.longitude.toFixed(4)}</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Source
                                    </Typography>
                                    <Typography variant="subtitle2">{selected.source}</Typography>
                                </Box>
                            </Stack>
                        </Stack>
                    </Paper>
                )
            )}

            <Stack gap={0.5}>
                <Typography variant="subtitle2">Status *</Typography>
                <FormControlLabel
                    control={<Switch color="success" checked={isActive} disabled={isEdit} onChange={(_, c) => setIsActive(c)} />}
                    label={isActive ? 'Active' : 'Inactive'}
                />
                <Typography variant="caption" color="text.secondary">
                    {isEdit
                        ? "Status can't be changed here yet."
                        : 'This bus station will be available for booking and driver availability.'}
                </Typography>
            </Stack>

            <Stack direction="row" justifyContent="flex-end" gap={1.5}>
                <Button variant="outlined" color="inherit" onClick={backToLocation} disabled={submitting}>
                    Cancel
                </Button>
                <Button variant="contained" color="success" onClick={handleSave} disabled={!selected || submitting || !dirty}>
                    Save Bus Station
                </Button>
            </Stack>
        </Stack>
    );
}
