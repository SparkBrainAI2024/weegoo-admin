// assets
import { IconFile, IconSettings } from '@tabler/icons-react';

// types
import { NavItemType } from 'types';

// ==============================|| MENU ITEMS - SETTINGS ||============================== //

const settings: NavItemType = {
    id: 'group-settings',
    title: 'SETTINGS',
    type: 'group',
    children: [
        {
            id: 'settings',
            title: 'Settings',
            type: 'item',
            url: '/settings',
            icon: IconSettings,
            breadcrumbs: true
        },
         {
            id: 'content',
            title: 'Content',
            type: 'item',
            url: '/content',
            icon: IconFile,
            breadcrumbs: true
        }
    ]
};

export default settings;