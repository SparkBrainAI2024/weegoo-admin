import { useState, ReactNode } from 'react';
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

interface Props {
    title: string;
    message: ReactNode;
    confirmLabel?: string;
    onConfirm: () => Promise<void>; // throw to keep the dialog open
    onClose: () => void;
}

export default function ConfirmDeleteDialog({ title, message, confirmLabel = 'Delete', onConfirm, onClose }: Props) {
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        setLoading(true);
        try {
            await onConfirm();
            onClose();
        } catch {
            setLoading(false); // caller already showed the error toast
        }
    };

    return (
        <Dialog open onClose={loading ? undefined : onClose} maxWidth="xs" fullWidth>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>{message}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loading}>
                    Cancel
                </Button>
                <Button
                    onClick={handleConfirm}
                    variant="contained"
                    color="error"
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
                >
                    {loading ? 'Deleting...' : confirmLabel}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
