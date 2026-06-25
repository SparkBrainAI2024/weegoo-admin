import { useEffect, useMemo } from 'react';
import { Outlet } from 'react-router-dom';
import { drawerWidth } from 'store/constant';

// material-ui
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import useMediaQuery from '@mui/material/useMediaQuery';

// project imports
import Header from './Header';
import Sidebar from './Sidebar';
import HorizontalBar from './HorizontalBar';
import MainContentStyled from './MainContentStyled';
import Customization from '../Customization';
import Loader from 'components/ui-component/Loader';

import useConfig from 'hooks/useConfig';
import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';

// types
import { MenuOrientation } from 'types/config';

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = () => {
    const theme = useTheme();
    const downMD = useMediaQuery(theme.breakpoints.down('md'));

    const { borderRadius, container, miniDrawer, menuOrientation } = useConfig();
    const { menuMaster, menuMasterLoading } = useGetMenuMaster();
    const drawerOpen = menuMaster?.isDashboardDrawerOpened;

    useEffect(() => {
        handlerDrawerOpen(!miniDrawer);
    }, [miniDrawer]);

    useEffect(() => {
        downMD && handlerDrawerOpen(false);
    }, [downMD]);

    const isHorizontal = menuOrientation === MenuOrientation.HORIZONTAL && !downMD;

    // horizontal menu-list bar : drawer
    const menu = useMemo(() => (isHorizontal ? <HorizontalBar /> : <Sidebar />), [isHorizontal]);

    if (menuMasterLoading) return <Loader />;

    return (
        <Box sx={{ display: 'flex' }}>
            {/* header */}
          <AppBar 
    enableColorOnDark 
    position="fixed" 
    color="inherit" 
    elevation={0} 
    sx={{ 
        width: `calc(100% - ${drawerOpen ? drawerWidth : 72}px)`,
        ml: `${drawerOpen ? drawerWidth : 72}px`,
        bgcolor: 'background.default',
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: drawerOpen 
                ? theme.transitions.duration.enteringScreen 
                : theme.transitions.duration.leavingScreen
        })
    }}
>
                <Toolbar sx={{ p: isHorizontal ? 1.25 : 2 }}>
                    <Header />
                </Toolbar>
            </AppBar>

            {/* menu / drawer */}
            {menu}

            {/* main content */}
            <MainContentStyled {...{ borderRadius, menuOrientation, open: drawerOpen, theme }}>
                <Container maxWidth={container ? 'lg' : false} {...(!container && { sx: { px: { xs: 0 } } })}>
                    <Outlet />
                </Container>
            </MainContentStyled>
            <Customization />
        </Box>
    );
};

export default MainLayout;
