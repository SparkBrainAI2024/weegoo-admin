// assets
import { IconLayoutDashboard, IconCar } from '@tabler/icons-react';

// types
import { NavItemType } from 'types';

// ==============================|| MENU ITEMS - MAIN ||============================== //

const main: NavItemType = {
    id: 'group-main',
    title: 'Main',
    type: 'group',
    children: [
        {
            id: 'dashboard',
            title: 'Dashboard',
            type: 'item',
            url: '/dashboard',
            icon: IconLayoutDashboard,
            breadcrumbs: false
        },
        {
            id: 'rides',
            title: 'Rides',
            type: 'item',
            url: '/rides',
            icon: IconCar,
            breadcrumbs: false
        }
    ]
};

export default main;