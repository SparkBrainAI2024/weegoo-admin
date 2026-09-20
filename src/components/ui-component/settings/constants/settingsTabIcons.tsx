import BusinessIcon from '@mui/icons-material/Business';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import BuildIcon from '@mui/icons-material/Build';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { SvgIconComponent } from '@mui/icons-material';

export const SETTINGS_TAB_ICONS: Record<string, SvgIconComponent> = {
    company: BusinessIcon,
    pricing: AttachMoneyIcon,
    maintenance: BuildIcon,
    notifications: NotificationsIcon
};
