import { memo, useMemo } from 'react';

// material-ui
import { Theme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import useMediaQuery from '@mui/material/useMediaQuery';

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';

// project imports
import MenuCard from './MenuCard';
import MenuList from '../MenuList';
import LogoSection from '../LogoSection';
import MiniDrawerStyled from './MiniDrawerStyled';
import Chip from 'components/ui-component/extended/Chip';

import useConfig from 'hooks/useConfig';
import { drawerWidth } from 'store/constant';

import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';

// types
import { MenuOrientation } from 'types/config';
import { IconButton, Typography } from '@mui/material';
import { Menu } from "@mui/icons-material";


// ==============================|| SIDEBAR DRAWER ||============================== //

const Sidebar = () => {
    const { menuMaster } = useGetMenuMaster();
    const drawerOpen = menuMaster.isDashboardDrawerOpened;

    const logo = useMemo(
        () => (
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: drawerOpen ? 'space-between' : 'center',
                p: 2,
                background: '#414141'
            }}>
                {drawerOpen && (
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <LogoSection />
                        <Typography variant="h2" color="#ffffff">WEEGOO</Typography>
                    </Stack>
                )}
                <IconButton onClick={() => handlerDrawerOpen(!drawerOpen)} sx={{ color: '#ffffff' }}>
                    <Menu sx={{ fontSize: { xs: 18, lg: 24 } }} />
                </IconButton>
            </Box>
        ),
        [drawerOpen]
    );

    const drawer = useMemo(() => {
        let drawerSX = { paddingLeft: '0px', paddingRight: '0px', marginTop: '20px' };
        if (drawerOpen) drawerSX = { paddingLeft: '16px', paddingRight: '16px', marginTop: '0px' };

        return (
            <PerfectScrollbar style={{ height: 'calc(100vh - 88px)', ...drawerSX }}>
                <MenuList />
            </PerfectScrollbar>
        );
    }, [drawerOpen]);

    return (
        <Box component="nav" sx={{ flexShrink: 0 }}>
            <MiniDrawerStyled variant="permanent" open={drawerOpen}>
                {logo}
                {drawer}
            </MiniDrawerStyled>
        </Box>
    );
};

export default memo(Sidebar);

