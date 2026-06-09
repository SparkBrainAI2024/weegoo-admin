// assets
import { IconCreditCard, IconGift, IconChartBar } from '@tabler/icons-react';

// types
import { NavItemType } from 'types';

// ==============================|| MENU ITEMS - OPERATIONS ||============================== //

const operations: NavItemType = {
    id: 'group-operations',
    title: 'OPERATIONS',
    type: 'group',
    children: [
        {
            id: 'payments',
            title: 'Payments',
            type: 'item',
            url: '/payments',
            icon: IconCreditCard,
            breadcrumbs: false
        },
        {
            id: 'offers',
            title: 'Offers',
            type: 'item',
            url: '/offers',
            icon: IconGift,
            breadcrumbs: false
        },
        {
            id: 'reports',
            title: 'Reports',
            type: 'item',
            url: '/reports',
            icon: IconChartBar,
            breadcrumbs: false
        }
    ]
};

export default operations;