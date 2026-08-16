import '@mui/material/Typography';

declare module '@mui/material/Typography' {
    interface TypographyPropsVariantOverrides {
        customInput: true;
        mainContent: true;
        menuCaption: true;
        subMenuCaption: true;
        commonAvatar: true;
        smallAvatar: true;
        mediumAvatar: true;
        largeAvatar: true;
        pageTitle: true;
        body3: true;
    }
}
