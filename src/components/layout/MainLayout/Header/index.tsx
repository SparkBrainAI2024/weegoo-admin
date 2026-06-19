import { useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import navigation from 'menu-items';
import NotificationSection from './NotificationSection';
import ProfileSection from './ProfileSection';
import MobileSection from './MobileSection';

import { NavItemType } from 'types';

// ==============================|| FIND CURRENT NAV ITEM ||============================== //

const findNavItem = (items: NavItemType[], pathname: string): NavItemType | undefined => {
    for (const item of items) {
        if (item.url === pathname) return item;
        if (item.children) {
            const found = findNavItem(item.children, pathname);
            if (found) return found;
        }
    }
    return undefined;
};

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const Header = () => {
    const location = useLocation();

    const currentItem = findNavItem(navigation.items, location.pathname);
    const Icon = currentItem?.icon;
    const title = currentItem?.title;

    return (
        <>
            {/* Page Title */}
            <Stack direction="row" alignItems="center" spacing={1.5}>
                {Icon && <Icon stroke={1.5} size="24px" />}
                <Typography variant="h2" fontWeight={600}>
                    {title}
                </Typography>
            </Stack>

            <Box sx={{ flexGrow: 1 }} />

            {/* Right side */}
            <NotificationSection />
            <ProfileSection />

            {/* Mobile */}
            <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                <MobileSection />
            </Box>
        </>
    );
};

export default Header;