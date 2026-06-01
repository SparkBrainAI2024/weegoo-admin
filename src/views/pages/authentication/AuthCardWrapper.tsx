// material-ui
import Box from '@mui/material/Box';

// project import
import MainCard, { MainCardProps } from 'components/ui-component/cards/MainCard';

// ==============================|| AUTHENTICATION CARD WRAPPER ||============================== //

const AuthCardWrapper = ({ children, ...other }: MainCardProps) => (
    <MainCard
        sx={{
            width: { xs: '100%', md: 508 },
            minWidth: 300,
            height: { xs: 'auto', md: 598 }

        }}
        content={false}
        {...other}
    >
        <Box sx={{ p: { xs: 3, md: 5 } }}>{children}</Box>
    </MainCard>
);

export default AuthCardWrapper;
