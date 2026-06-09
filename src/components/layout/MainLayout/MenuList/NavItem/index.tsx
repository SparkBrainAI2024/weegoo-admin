import { useEffect, useRef, useState } from 'react';
import { Link, matchPath, useLocation } from 'react-router-dom';

// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import ButtonBase from '@mui/material/ButtonBase';
import Chip from '@mui/material/Chip';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

// project imports
import useConfig from 'hooks/useConfig';
import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';

// assets
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

// types
import { MenuOrientation, ThemeMode } from 'types/config';
import { LinkTarget, NavItemType } from 'types';

// ==============================|| SIDEBAR MENU LIST ITEMS ||============================== //

interface NavItemProps {
    item: NavItemType;
    level: number;
    isParents?: boolean;
    setSelectedID?: () => void;
}

const NavItem = ({ item, level, isParents = false, setSelectedID }: NavItemProps) => {
    const theme = useTheme();
    const downMD = useMediaQuery(theme.breakpoints.down('md'));
    const ref = useRef<HTMLSpanElement>(null);

    const { pathname } = useLocation();
    const { mode, menuOrientation, borderRadius } = useConfig();

    const { menuMaster } = useGetMenuMaster();
    const drawerOpen = menuMaster.isDashboardDrawerOpened;
    const isHorizontal = menuOrientation === MenuOrientation.HORIZONTAL && !downMD;
    const isSelected = !!matchPath({ path: item?.link ? item.link : item.url!, end: false }, pathname);

    const [hoverStatus, setHover] = useState<boolean>(false);

    const compareSize = () => {
        const compare = ref.current && ref.current.scrollWidth > ref.current.clientWidth;
        setHover(compare as boolean);
    };

    useEffect(() => {
        compareSize();
        window.addEventListener('resize', compareSize);
        window.removeEventListener('resize', compareSize);
    }, []);

    const Icon = item?.icon!;
    const itemIcon = item?.icon ? (
        <Icon
            stroke={1.5}
            size={drawerOpen ? '20px' : '24px'}
            style={{ ...(isHorizontal && isParents && { fontSize: 20, stroke: '1.5' }) }}
        />
    ) : (
        <FiberManualRecordIcon sx={{ width: isSelected ? 8 : 6, height: isSelected ? 8 : 6 }} fontSize={level > 0 ? 'inherit' : 'medium'} />
    );

    let itemTarget: LinkTarget = '_self';
    if (item.target) {
        itemTarget = '_blank';
    }

    const itemHandler = () => {
        if (downMD) handlerDrawerOpen(false);

        if (isParents && setSelectedID) {
            setSelectedID();
        }
    };

    const iconSelectedColor = mode === ThemeMode.DARK && drawerOpen ? 'text.primary' : '#E5E2E2';

    return (
        <>
            {!isHorizontal ? (
                <ListItemButton
                    component={Link}
                    to={item.url!}
                    target={itemTarget}
                    disabled={item.disabled}
                    disableRipple={!drawerOpen}
                    sx={{
                        zIndex: 1201,
                        borderRadius: `${borderRadius}px`,
                        mb: 0.5,
                        pl: drawerOpen ? `${level * 24}px` : 1.25,
                        ...(drawerOpen &&
                            level === 1 &&
                            mode !== ThemeMode.DARK && {
                            '&:hover': {
                                color: '#E5E2E2',
                                bgcolor: '#4caf50'
                            },
                            '&.Mui-selected': {
                                bgcolor: '#4caf50',
                                color: '#E5E2E2',
                                '&:hover': {
                                    color: '#E5E2E2',
                                    bgcolor: '#4caf50'
                                }
                            }
                        }),
                        ...((!drawerOpen || level !== 1) && {
                            py: level === 1 ? 0 : 1,
                            '&:hover': {
                                color: '#E5E2E2',
                                bgcolor: '#4caf50'
                            },
                            '&.Mui-selected': {
                                '&:hover': {
                                    color: '#E5E2E2',
                                    bgcolor: '#4caf50'
                                },
                                color: '#E5E2E2',
                                bgcolor: '#4caf50'
                            }
                        })
                    }}
                    selected={isSelected}
                    onClick={() => itemHandler()}
                >
                    <ButtonBase aria-label="theme-icon" sx={{
                        borderRadius: `${borderRadius}px`,
                        color: 'inherit'  // ← here
                    }} disableRipple={drawerOpen}>
                        <ListItemIcon
                            sx={{
                                minWidth: level === 1 ? 36 : 18,
                                color: isSelected ? iconSelectedColor : '#E5E2E2',
                                ...(!drawerOpen &&
                                    level === 1 && {
                                    borderRadius: `${borderRadius}px`,
                                    width: 46,
                                    height: 46,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    '&:hover': {
                                        bgcolor: mode === ThemeMode.DARK ? alpha(theme.palette.secondary.main, 0.25) : '#4caf50'
                                    },
                                    ...(isSelected && {
                                        bgcolor:
                                            mode === ThemeMode.DARK ? alpha(theme.palette.secondary.main, 0.25) : '#4caf50',
                                        '&:hover': {
                                            bgcolor:
                                                mode === ThemeMode.DARK ? alpha(theme.palette.secondary.main, 0.3) : '#4caf50'
                                        }
                                    })
                                }),
                                '& svg': {
                                    color: '#E5E2E2'  // ← force icon color directly
                                },

                            }}
                        >






                            {itemIcon}
                        </ListItemIcon>
                    </ButtonBase>

                    {(drawerOpen || (!drawerOpen && level !== 1)) && (
                        <Tooltip title={item.title} disableHoverListener={!hoverStatus}>
                            <ListItemText
                                primary={
                                    <Typography
                                        ref={ref}
                                        noWrap
                                        overflow="hidden"
                                        textOverflow="ellipsis"
                                        variant={isSelected ? 'h5' : 'body1'}
                                        color="#E5E2E2"
                                        width={102}
                                    >
                                        {item.title}
                                    </Typography>
                                }
                                secondary={
                                    item.caption && (
                                        <Typography
                                            variant="caption"
                                            sx={{ ...theme.typography.subMenuCaption }}
                                            display="block"
                                            gutterBottom
                                        >
                                            {item.caption}
                                        </Typography>
                                    )
                                }
                            />
                        </Tooltip>
                    )}

                    {drawerOpen && item.chip && (
                        <Chip
                            color={item.chip.color}
                            variant={item.chip.variant}
                            size={item.chip.size}
                            label={item.chip.label}
                            avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
                        />
                    )}
                </ListItemButton>
            ) : (
                <ListItemButton
                    component={Link}
                    to={item.url!}
                    target={itemTarget}
                    disabled={item.disabled}
                    sx={{
                        borderRadius: isParents ? `${borderRadius}px` : 0,
                        mb: isParents ? 0 : 0.5,
                        alignItems: 'flex-start',
                        backgroundColor: level > 1 ? 'transparent !important' : 'inherit',
                        py: 1,
                        pl: 2,
                        mr: isParents ? 1 : 0
                    }}
                    selected={isSelected}
                    onClick={() => itemHandler()}
                >
                    <ListItemIcon
                        sx={{
                            my: 'auto',
                            minWidth: !item?.icon ? 18 : 36
                        }}
                    >
                        {itemIcon}
                    </ListItemIcon>

                    <ListItemText
                        primary={
                            <Typography variant={isSelected ? 'h5' : 'body1'} color="inherit">
                                {item.title}
                            </Typography>
                        }
                        secondary={
                            item.caption && (
                                <Typography variant="caption" sx={{ ...theme.typography.subMenuCaption }} display="block" gutterBottom>
                                    {item.caption}
                                </Typography>
                            )
                        }
                    />

                    {item.chip && (
                        <Chip
                            color={item.chip.color}
                            variant={item.chip.variant}
                            size={item.chip.size}
                            label={item.chip.label}
                            avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
                        />
                    )}
                </ListItemButton>
            )}
        </>
    );
};

export default NavItem;
