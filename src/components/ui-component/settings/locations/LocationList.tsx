import { Avatar, Box, List, ListItemButton, ListItemAvatar, ListItemText, Skeleton, Stack, Typography } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { LocationDetail } from 'graphql/queries/locations.queries';

interface Props {
    locations: LocationDetail[];
    total: number;
    selectedId: string | null;
    loading?: boolean;
    onSelect: (id: string) => void;
}

export default function LocationList({ locations, total, selectedId, loading, onSelect }: Props) {
    return (
        <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, overflow: 'hidden' }}>
            <Typography variant="h5" sx={{ px: 2.5, py: 2 }}>
                Locations ({total})
            </Typography>

            <List disablePadding>
                {loading
                    ? Array.from({ length: 6 }).map((_, i) => (
                          <Stack key={i} direction="row" alignItems="center" gap={2} sx={{ px: 2.5, py: 1.5 }}>
                              <Skeleton variant="circular" width={40} height={40} />
                              <Skeleton variant="text" width="50%" />
                          </Stack>
                      ))
                    : locations.map((loc) => {
                          const selected = loc._id === selectedId;
                          return (
                              <ListItemButton
                                  key={loc._id}
                                  selected={selected}
                                  onClick={() => onSelect(loc._id)}
                                  sx={{ px: 2.5, py: 1.5, borderTop: '1px solid', borderColor: 'divider' }}
                              >
                                  <ListItemAvatar>
                                      <Avatar
                                          sx={{
                                              bgcolor: selected ? 'success.light' : 'grey.100',
                                              color: selected ? 'success.dark' : 'text.secondary'
                                          }}
                                      >
                                          <LocationOnIcon fontSize="small" />
                                      </Avatar>
                                  </ListItemAvatar>
                                  <ListItemText
                                      primary={loc.name}
                                      secondary={`${loc.subLocations.length} bus stations`}
                                      primaryTypographyProps={{ variant: 'subtitle1' }}
                                      secondaryTypographyProps={{ variant: 'caption' }}
                                  />
                                  <ChevronRightIcon fontSize="small" color="action" />
                              </ListItemButton>
                          );
                      })}
            </List>
        </Box>
    );
}
