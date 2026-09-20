import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';
import AirportShuttleIcon from '@mui/icons-material/AirportShuttle';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import ElectricMopedIcon from '@mui/icons-material/ElectricMoped';
import { SvgIconComponent } from '@mui/icons-material';

export const VEHICLE_ICONS: Record<string, SvgIconComponent> = {
    CAR: DirectionsCarIcon,
    JEEP: AirportShuttleIcon,
    MICRO: DirectionsCarFilledIcon,
    MOTORBIKE: TwoWheelerIcon,
    SCOOTER: ElectricMopedIcon
};
