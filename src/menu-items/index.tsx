import { NavItemType } from 'types';
import main from './main';
import users from './users';
import operations from './operations';
import settings from './settings';


// ==============================|| MENU ITEMS ||============================== //

const menuItems: { items: NavItemType[] } = {
    items: [main, users, operations, settings]
};

export default menuItems;