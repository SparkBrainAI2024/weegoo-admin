import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, CircularProgress } from '@mui/material';

interface BlockDriverDialogProps {
    open: boolean;
    driverName: string;
    isCurrentlyBlocked: boolean;
    loading: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export const BlockDriverDialog = ({ open, driverName, isCurrentlyBlocked, loading, onClose, onConfirm }: BlockDriverDialogProps) => {
    const actionLabel = isCurrentlyBlocked ? 'Unblock' : 'Block';

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>{actionLabel} Driver</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure you want to {actionLabel.toLowerCase()} <strong>{driverName}</strong>?
                    {!isCurrentlyBlocked && <> This driver will not be able to accept new rides while blocked.</>}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loading}>
                    Cancel
                </Button>
                <Button
                    onClick={onConfirm}
                    color={isCurrentlyBlocked ? 'success' : 'error'}
                    variant="contained"
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
                >
                    {loading ? 'Processing...' : actionLabel}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
