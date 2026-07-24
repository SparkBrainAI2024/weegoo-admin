// theme/tableTokens.ts
//
// Reusable status-color and typography-variant mapping for list/table pages
// (Drivers, Riders, Rides...). Import this instead of hardcoding colors or
// variants per-page so every table stays visually consistent.

import { Theme } from '@mui/material/styles';
import { Variant } from '@mui/material/styles/createTypography';

// ==============================|| STATUS -> COLOR MAPPING ||============================== //

export type RowStatus = 'active' | 'pending' | 'blocked';

export const getStatusColors = (theme: Theme, status: RowStatus) => {
    const map: Record<RowStatus, { main: string; bg: string }> = {
        active: { main: theme.palette.success.main, bg: theme.palette.success.light },
        pending: { main: theme.palette.warning.main, bg: theme.palette.warning.light },
        blocked: { main: theme.palette.error.main, bg: theme.palette.error.light }
    };
    return map[status];
};

// ==============================|| ACTIVE TAB BORDER ||============================== //
// TODO: confirm against _themes-vars.module.scss — #42C018 doesn't map to an
// existing palette entry yet. Swap this for theme.palette.success.main (or a
// new dedicated key) once confirmed; don't leave it as a raw hex long-term.
export const ACTIVE_TAB_BORDER = '#42C018';

// ==============================|| SEMANTIC COLOR ROLES ||============================== //

export const getTableColors = (theme: Theme) => ({
    title: theme.palette.text.dark, // page title, table column headers
    primaryText: theme.palette.text.primary, // driver/rider name, phone, row data
    secondaryText: theme.palette.text.secondary, // ID line, "Rows per page", search placeholder
    selectedTab: theme.palette.primary.main, // selected/brand state, reused wherever something is "current"
    unselectedTab: theme.palette.text.secondary,
    money: theme.palette.success.main, // earnings amount — same "positive" association as Active status
    ratingStar: theme.palette.orange.main, // dedicated orange token, kept separate from warning (=Pending)
    destructiveAction: theme.palette.error.main, // Delete in row menu
    neutralAction: theme.palette.text.secondary, // Block in row menu
    avatarBg: theme.palette.secondary.light,
    avatarText: theme.palette.text.dark
});

// ==============================|| TYPOGRAPHY VARIANT ROLES ||============================== //
// Use these variant names directly on <Typography variant={...}> — don't
// introduce new one-off sizes per page.

export const tableTypography: Record<string, Variant> = {
    pageTitle: 'h1', // "Drivers"
    columnHeader: 'h6', // Driver / Phone / Status / Rides / Rating / Earnings
    rowPrimary: 'subtitle1', // driver name
    rowBody: 'body2', // phone, rating number
    rowMeta: 'caption', // "ID • 1000", "Rows per page: 10"
    statusChip: 'subtitle2', // status pill label
    emphasizedSmall: 'subtitle2', // earnings amount, pagination page numbers
    filterTabLabel: 'subtitle1', // Active / Pending / Blocked
    filterCount: 'caption', // (58) (12) badge next to tab
    searchInput: 'body1'
};

// ==============================|| VARIANT -> STYLE LOOKUP ||============================== //
// Use this instead of indexing theme.typography[...] directly at call sites —
// theme.typography has no string index signature, so a raw index access
// resolves to `any` and TS flags it (even when the key is `as const`-narrowed
// coming from a separate object like tableTypography above). Routing every
// lookup through this one typed function keeps that workaround in one place.
export const getVariantStyle = (theme: Theme, variant: Variant) => theme.typography[variant];
