// assets
import { IconSettings, IconFileDescription, IconMail } from '@tabler/icons-react';

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
            id: 'page-management',
            title: 'Page Management',
            type: 'item',
            url: '/page-management',
            icon: IconFileDescription,
            breadcrumbs: true
        },
        {
            id: 'email-template',
            title: 'Email Template',
            type: 'item',
            url: '/email-template',
            icon: IconMail,
            breadcrumbs: true
        }
    ]
};

export default settings;