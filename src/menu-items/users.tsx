// assets
import { IconUsers } from '@tabler/icons-react';

// types
import { NavItemType } from 'types';
import { PersonOutline } from '@mui/icons-material';
import IconDrivers from 'assets/images/icons/DriversIcon';

// ==============================|| MENU ITEMS - USERS ||============================== //

const users: NavItemType = {
    id: 'group-users',
    title: 'USERS',
    type: 'group',
    children: [
        {
            id: 'drivers',
            title: 'Drivers',
            type: 'item',
            url: '/drivers',
            icon: IconDrivers,
            breadcrumbs: true
            // chip prop can be added here for the red badge (e.g. pending driver approvals)
            // chip: { color: 'error', label: '2' }
        },
        {
            id: 'passengers',
            title: 'Passengers',
            type: 'item',
            url: '/passengers',
            icon: IconUsers,
            breadcrumbs: true
        }
    ]
};

export default users;
