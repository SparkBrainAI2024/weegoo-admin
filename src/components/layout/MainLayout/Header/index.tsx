// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';

// project imports
import useConfig from 'hooks/useConfig';
import LogoSection from '../LogoSection';
import SearchSection from './SearchSection';
import MobileSection from './MobileSection';
import ProfileSection from './ProfileSection';
import LocalizationSection from './LocalizationSection';
import MegaMenuSection from './MegaMenuSection';
import FullScreenSection from './FullScreenSection';
import NotificationSection from './NotificationSection';

import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';

// assets
import { IconMenu2 } from '@tabler/icons-react';

// types
import { MenuOrientation, ThemeMode } from 'types/config';

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const Header = () => {
    const theme = useTheme();
    const downMD = useMediaQuery(theme.breakpoints.down('md'));

    const { mode, menuOrientation } = useConfig();
    const { menuMaster } = useGetMenuMaster();
    const drawerOpen = menuMaster.isDashboardDrawerOpened;
    const isHorizontal = menuOrientation === MenuOrientation.HORIZONTAL && !downMD;

    return (
        <>
            {/* logo & toggler button */}


            {/* header search */}
            <SearchSection />
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ flexGrow: 1 }} />

            {/* profile */}
            <ProfileSection />

            {/* mobile header */}
            <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                <MobileSection />
            </Box>
        </>
    );
};

export default Header;
