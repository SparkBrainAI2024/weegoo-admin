// assets
import { IconUser, IconUsers } from '@tabler/icons-react';
import drivers from '../components/ui-component/IconsMenu';

// types
import { NavItemType } from 'types';

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
            icon: drivers,
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
