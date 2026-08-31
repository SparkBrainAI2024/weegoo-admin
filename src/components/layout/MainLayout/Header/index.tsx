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

import { IconGift, IconUsers, IconCreditCard, IconReportAnalytics, IconMail, IconCar } from '@tabler/icons-react';

// types
import { NavItemType, OverrideIcon } from 'types';
import { IconFileText } from '@tabler/icons-react';
import IconDrivers from 'assets/images/icons/DriversIcon';
import { useUrlParams } from 'hooks/useSearchParams';
import { DateRangeFilter, DateRangeValue } from 'components/ui-component/home-dashboard/DateRangeFilter';
import dayjs from 'dayjs';

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

    { pattern: '/reports/:id', title: 'Report Detail', icon: IconGift },
    { pattern: '/drivers/:id', title: 'Driver', icon: IconDrivers },
    { pattern: '/passengers/:id', title: 'Rider Detail', icon: IconUsers },

    { pattern: '/rides/:id', title: 'Ride Details', icon: IconCar },
    { pattern: '/payments/:id', title: 'Payment Detail', icon: IconCreditCard },
    { pattern: '/reports/:id', title: 'Report Detail', icon: IconReportAnalytics },
    { pattern: '/page-management/add', title: 'Page Management', icon: IconFileText },
    { pattern: '/page-management/:slug/edit', title: 'Page Management', icon: IconFileText },
    { pattern: '/email-template/add', title: 'Email Template', icon: IconMail },
    { pattern: '/email-template/:slug/edit', title: 'Email Template', icon: IconMail }
];

const findDetailRoute = (pathname: string): DetailRoute | undefined => DETAIL_ROUTES.find((route) => matchPath(route.pattern, pathname));

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const Header = () => {
    const location = useLocation();
    const { getParam, updateParams } = useUrlParams();

    const currentItem = findNavItem(navigation.items, location.pathname);
    const detailMatch = !currentItem ? findDetailRoute(location.pathname) : undefined;

    const Icon = currentItem?.icon || detailMatch?.icon;
    const title = currentItem?.title || detailMatch?.title;
    const isDashboard = location.pathname === '/dashboard/default';

    const range: DateRangeValue = {
        fromDate: dayjs(getParam('fromDate', dayjs().subtract(6, 'day').format('YYYY-MM-DD'))),
        endDate: dayjs(getParam('endDate', dayjs().format('YYYY-MM-DD')))
    };

    const handleRangeChange = (val: DateRangeValue) => {
        updateParams({
            fromDate: val.fromDate!.format('YYYY-MM-DD'),
            endDate: val.endDate!.format('YYYY-MM-DD')
        });
    };

    return (
        <>
            <Stack direction="row" alignItems="center" spacing={1.5}>
                {Icon && <Icon stroke={1.5} size="24px" />}
                <Typography variant="pageTitle">{title}</Typography>
            </Stack>

            <Box sx={{ marginLeft: '12px', padding: '0 !important' }}>
                {isDashboard && <DateRangeFilter value={range} onChange={handleRangeChange} />}
            </Box>
            <Box sx={{ flexGrow: 1 }} />

            <NotificationSection />
            <ProfileSection />

            <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                <MobileSection />
            </Box>
        </>
    );
};
export default Header;
