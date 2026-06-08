// material-ui
import { styled } from '@mui/material/styles';

// types
import { ThemeMode } from 'types/config';

// ==============================|| AUTHENTICATION 1 WRAPPER ||============================== //

const AuthWrapper1 = styled('div')(({ theme }) => ({
    backgroundColor:  "#CDE0C7" ,
    minHeight: '100vh',
    display: 'flex',
alignItems: 'center',
justifyContent: 'center',
}));

export default AuthWrapper1;