// types
import { ConfigProps, MenuOrientation, ThemeDirection, ThemeMode } from 'types/config';

export const DASHBOARD_PATH = '/dashboard/default';
export const HORIZONTAL_MAX_ITEM = 7;

const config: ConfigProps = {
    menuOrientation: MenuOrientation.VERTICAL,
    miniDrawer: false,
    fontFamily: `'Roboto', sans-serif`,
    borderRadius: 8,
    outlinedFilled: true,
    mode: ThemeMode.LIGHT,
    presetColor: 'default',
    i18n: 'en',
    themeDirection: ThemeDirection.LTR,
    container: false
};

export default config;
