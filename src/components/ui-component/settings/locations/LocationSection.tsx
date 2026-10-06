import { useEffect, useState } from 'react';
import { Button, Grid, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { useDebounce } from 'hooks/useDebounce';
import { useUrlParams } from 'hooks/useSearchParams';
import LocationList from './LocationList';
import { useLocations } from 'hooks/useLocations';
import { useLocation } from 'hooks/useLocation';
import LocationDetailPanel from './LocationDetailPanel';
import { LOCATION_ROUTES } from '../constants/routes';
import { useNavigate } from 'react-router';

export default function LocationsSection() {
    const { getParam, updateParams } = useUrlParams();
    const selectedId = getParam<string>('locationId', '') || null;
    const navigate = useNavigate();
    const [searchInput, setSearchInput] = useState('');
    const debouncedSearch = useDebounce(searchInput, 400);

    const { locations, total, loading: listLoading } = useLocations(debouncedSearch);
    const { location, loading: detailLoading } = useLocation(selectedId);

    // auto-select the first location on load
    useEffect(() => {
        if (!selectedId && locations.length > 0) {
            updateParams({ locationId: locations[0]._id });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedId, locations]);

    // TODO: open dialogs + wire mutations once shared
    const handleAddLocation = () => {
        navigate(LOCATION_ROUTES.new);
    };

    return (
        <Stack gap={3} p={1}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={2}>
                <Stack gap={0.5} maxWidth={520}>
                    <Typography variant="h5">Locations & Bus Stations</Typography>
                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{
                            fontSize: '0.625rem',
                            letterSpacing: '0.02rem'
                        }}
                    >
                        Manage ride locations and bus stations. Drivers can set their availability from these points, and customers can book
                        rides using the same locations.
                    </Typography>
                </Stack>

                <Stack direction="row" gap={1.5} alignItems="center">
                    <Button
                        variant="outlined"
                        color="success"
                        startIcon={<AddIcon />}
                        onClick={handleAddLocation}
                        sx={{
                            fontWeight: 400,
                            fontSize: '0.75rem',
                            whiteSpace: 'nowrap',
                            '& .MuiButton-startIcon': {
                                marginRight: 0.5,
                                marginLeft: 0
                            }
                        }}
                    >
                        Add Location
                    </Button>
                    <TextField
                        size="small"
                        placeholder="Search location or bus station..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        sx={{
                            minWidth: 280,
                            '& .MuiInputBase-input::placeholder': {
                                fontSize: '0.75rem',
                                opacity: 1
                            }
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon fontSize="small" color="disabled" />
                                </InputAdornment>
                            )
                        }}
                    />
                </Stack>
            </Stack>

            <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                    <LocationList
                        locations={locations}
                        total={total}
                        selectedId={selectedId}
                        loading={listLoading}
                        onSelect={(id) => updateParams({ locationId: id })}
                    />
                </Grid>
                <Grid item xs={12} md={9}>
                    <LocationDetailPanel location={location} loading={detailLoading} />
                </Grid>
            </Grid>
        </Stack>
    );
}
