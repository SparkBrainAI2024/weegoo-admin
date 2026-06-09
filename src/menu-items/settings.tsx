// assets
import { IconSettings } from '@tabler/icons-react';

// types
import { NavItemType } from 'types';

// ==============================|| MENU ITEMS - SETTINGS ||============================== //

const settings: NavItemType = {
    id: 'group-settings',
    title: 'Settings',
    type: 'group',
    children: [
        {
            id: 'settings',
            title: 'Settings',
            type: 'item',
            url: '/settings',
            icon: IconSettings,
            breadcrumbs: false
        }
    ]
};

export default settings;