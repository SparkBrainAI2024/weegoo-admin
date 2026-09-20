import { Avatar } from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'; // fallback
import { VEHICLE_ICONS } from './settings/constants/vehicleIcons';

interface VehicleTypeIconProps {
    type: string;
    size?: number; // avatar diameter in px
}

export default function VehicleTypeIcon({ type, size = 40 }: VehicleTypeIconProps) {
    const Icon = VEHICLE_ICONS[type] ?? DirectionsCarIcon;

    return (
        <Avatar
            sx={{
                width: size,
                height: size,
                bgcolor: '#E3F7E9', // or a custom light-green e.g. '#E3F7E9'
                color: '#1C3E43'
            }}
        >
            <Icon sx={{ fontSize: size * 0.5 }} />
        </Avatar>
    );
}
