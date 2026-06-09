// assets
import { IconUser, IconUsers } from '@tabler/icons-react';

// types
import { NavItemType } from 'types';

// ==============================|| MENU ITEMS - USERS ||============================== //

const users: NavItemType = {
    id: 'group-users',
    title: 'Users',
    type: 'group',
    children: [
        {
            id: 'drivers',
            title: 'Drivers',
            type: 'item',
            url: '/drivers',
            icon: IconUser,
            breadcrumbs: false
            // chip prop can be added here for the red badge (e.g. pending driver approvals)
            // chip: { color: 'error', label: '2' }
        },
        {
            id: 'riders',
            title: 'Riders',
            type: 'item',
            url: '/riders',
            icon: IconUsers,
            breadcrumbs: false
        }
    ]
};

export default users;