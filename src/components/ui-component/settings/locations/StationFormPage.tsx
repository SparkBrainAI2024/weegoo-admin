import { IconButton, Stack, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router';
import { LOCATION_ROUTES } from '../constants/routes';

export default function StationFormPage() {
    const { locationId = '' } = useParams();
    const navigate = useNavigate();

    return (
        <Stack direction="row" alignItems="center" gap={1.5} p={3}>
            <IconButton onClick={() => navigate(LOCATION_ROUTES.edit(locationId))} aria-label="Back to location">
                <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4">Bus Station</Typography>
        </Stack>
    );
}
