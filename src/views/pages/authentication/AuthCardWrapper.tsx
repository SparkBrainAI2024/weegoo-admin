// material-ui
import Box from '@mui/material/Box';

// project import
import MainCard, { AuthCardWrapperProps, MainCardProps } from 'components/ui-component/cards/MainCard';
import { PAGE_TOKEN } from 'constants/pages';

// ==============================|| AUTHENTICATION CARD WRAPPER ||============================== //

const AuthCardWrapper = ({ children,page, ...other }: AuthCardWrapperProps) => (
    <MainCard
    sx={{
        width: { xs: '100%', md: page === PAGE_TOKEN.LOGIN ? '508px' : (page === PAGE_TOKEN.FORGOT_PASSWORD ? '461px' : '300') },
        height: { xs: 'auto', md: page === PAGE_TOKEN.LOGIN ? '598px' : (page === PAGE_TOKEN.FORGOT_PASSWORD ? '380px' : '300') },
        overflow: 'hidden'
    }}
 

        content={false}
        {...other}
    >
        <Box sx={{ px: { xs: 3, md: 5 },py: { xs: 2, md: "23px" } }}>{children}</Box>
    </MainCard>
);

export default AuthCardWrapper;
