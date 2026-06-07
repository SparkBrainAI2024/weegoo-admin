// material-ui
import Box from '@mui/material/Box';

// project import
import MainCard, { AuthCardWrapperProps, MainCardProps } from 'components/ui-component/cards/MainCard';
import { PAGE_TOKEN } from 'constants/pages';
const AUTH_CARD_WIDTHS = {
    [PAGE_TOKEN.LOGIN]: '508px',
    [PAGE_TOKEN.RESET_PASSWORD]: '508px',
    [PAGE_TOKEN.FORGOT_PASSWORD]: '461px',
    [PAGE_TOKEN.VERIFY_OTP]: '461px',
};


// ==============================|| AUTHENTICATION CARD WRAPPER ||============================== //

const AuthCardWrapper = ({ children, page, ...other }: AuthCardWrapperProps) => {
    const width = AUTH_CARD_WIDTHS[page] ?? '360px';

    return (
        <MainCard
            sx={{
                width: { xs: '100%', sm: width },
            }}
            content={false}
            {...other}
        >
            <Box sx={{
                px: { xs: 3, md: 5 },
                py: { xs: 2, md: 4 }
            }}>
                {children}
            </Box>
        </MainCard>
    );
};

export default AuthCardWrapper;
