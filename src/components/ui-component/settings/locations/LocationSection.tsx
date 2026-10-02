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

export default function LocationsSection() {
    const { getParam, updateParams } = useUrlParams();
    const selectedId = getParam<string>('locationId', '') || null;

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
    const handleAddLocation = () => {};

    return (
        <Stack gap={3} p={2}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={2}>
                <Stack gap={0.5} maxWidth={520}>
                    <Typography variant="h4">Locations & Bus Stations</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Manage ride locations and bus stations. Drivers can set their availability from these points, and customers can book
                        rides using the same locations.
                    </Typography>
                </Stack>

                <Stack direction="row" gap={1.5} alignItems="center">
                    <Button variant="outlined" color="success" startIcon={<AddIcon />} onClick={handleAddLocation}>
                        Add Location
                    </Button>
                    <TextField
                        size="small"
                        placeholder="Search location or bus station..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        sx={{ minWidth: 280 }}
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

            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <LocationList
                        locations={locations}
                        total={total}
                        selectedId={selectedId}
                        loading={listLoading}
                        onSelect={(id) => updateParams({ locationId: id })}
                    />
                </Grid>
                <Grid item xs={12} md={8}>
                    <LocationDetailPanel location={location} loading={detailLoading} />
                </Grid>
            </Grid>
        </Stack>
    );
}
