import { matchPath, useLocation } from 'react-router-dom';

// material-ui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project imports
import navigation from 'menu-items';
import NotificationSection from './NotificationSection';
import ProfileSection from './ProfileSection';
import MobileSection from './MobileSection';

// assets
import { IconGift, IconUser, IconUsers, IconCreditCard, IconReportAnalytics } from '@tabler/icons-react';

// types
import { NavItemType, OverrideIcon } from 'types';
import { IconFileText } from '@tabler/icons-react';

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

// ==============================|| DETAIL ROUTE TITLES ||============================== //
// for routes that aren't in the sidebar menu config (e.g. /offers/:id)
// add a new entry here whenever a new detail page is created

interface DetailRoute {
    pattern: string;
    title: string;
    icon?: OverrideIcon;
}

const DETAIL_ROUTES: DetailRoute[] = [
    { pattern: '/offers/:id', title: 'Offer Detail', icon: IconGift },
    { pattern: '/drivers/:id', title: 'Driver Detail', icon: IconUser },
    { pattern: '/passengers/:id', title: 'Rider Detail', icon: IconUsers },
    { pattern: '/payments/:id', title: 'Payment Detail', icon: IconCreditCard },
    { pattern: '/reports/:id', title: 'Report Detail', icon: IconReportAnalytics },
    { pattern: '/page-management/add', title: 'Page Management', icon: IconFileText },
    { pattern: '/page-management/:slug/edit', title: 'Page Management', icon: IconFileText }
];

const findDetailRoute = (pathname: string): DetailRoute | undefined => DETAIL_ROUTES.find((route) => matchPath(route.pattern, pathname));

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const Header = () => {
    const location = useLocation();

    const currentItem = findNavItem(navigation.items, location.pathname);
    const detailMatch = !currentItem ? findDetailRoute(location.pathname) : undefined;

    const Icon = currentItem?.icon || detailMatch?.icon;
    const title = currentItem?.title || detailMatch?.title;

    return (
        <>
            {/* Page Title */}
            <Stack direction="row" alignItems="center" spacing={1.5}>
                {Icon && <Icon stroke={1.5} size="24px" />}
                <Typography variant="pageTitle">{title}</Typography>
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
