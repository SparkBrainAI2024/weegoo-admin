import { Alert, Snackbar } from '@mui/material';
import { UI } from 'constants/ui';

interface NotificationProps {
    open: boolean;
    message: string;
    severity?: 'error' | 'warning' | 'info' | 'success';
    onClose: () => void;
}


export default function NotificationBanner({
    open,
    message,
    severity = 'error',
    onClose,
}: NotificationProps) {
    return (
        <Snackbar
        
            open={open}
            autoHideDuration={UI.HIDE_DURATION}
            onClose={onClose}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'center'
            }}
            sx={{
                width: '100%'
            }}
        >
            <Alert
            icon={false}
                onClose={onClose}
                severity={severity}
                variant="filled"
                sx={{
                    width: '33.33%',
                    borderRadius: 2,
                    boxShadow: 4,
                    justifyContent: 'center',
                    '& .MuiAlert-message': {
                        textAlign: 'center',
                        width: '100%'
                    }
                }}
            >
                {message}
            </Alert>
        </Snackbar>
    );
}