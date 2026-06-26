// assets
import { IconLayoutDashboard, IconCar } from '@tabler/icons-react';

// types
import { NavItemType } from 'types';

// ==============================|| MENU ITEMS - MAIN ||============================== //

const main: NavItemType = {
    id: 'group-main',
    title: 'MAIN',
    type: 'group',
    children: [
        {
            id: 'dashboard',
            title: 'Dashboard',
            type: 'item',
            url: '/dashboard/default',
            icon: IconLayoutDashboard,
            breadcrumbs: true
        },
        {
            id: 'rides',
            title: 'Rides',
            type: 'item',
            url: '/rides',
            icon: IconCar,
            breadcrumbs: true
        }
    ]
};

export default main;
