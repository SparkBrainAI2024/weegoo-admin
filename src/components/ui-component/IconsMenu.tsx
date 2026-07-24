// components/icons/DriversIcon.tsx
import driversIcon from '../../assets/images/users/drivers-icon.png';

interface DriversIconProps {
    size?: string | number;
    stroke?: number;
    className?: string;
}

const DriversIcon = ({ size = 20, className }: DriversIconProps) => (
    <img src={driversIcon} alt="Drivers" style={{ width: size, height: size, objectFit: 'contain' }} className={className} />
);

export default DriversIcon;
