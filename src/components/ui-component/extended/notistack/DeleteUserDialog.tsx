// components/drivers/DeleteDriverDialog.tsx
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';

interface Props {
    open: boolean;
    userName?: string;
    onClose: () => void;
    onConfirm: () => void;
    loading?: boolean;
}

export const DeleteUserDialog = ({ open, userName, onClose, onConfirm, loading }: Props) => (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
        <DialogTitle>Delete driver?</DialogTitle>
        <DialogContent>
            <DialogContentText>
                This will remove <strong>{userName || 'this driver'}</strong> from the active list. This action can be reversed by an admin
                later.
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose} disabled={loading}>
                Cancel
            </Button>
            <Button onClick={onConfirm} color="error" variant="contained" disabled={loading}>
                {loading ? 'Deleting...' : 'Delete'}
            </Button>
        </DialogActions>
    </Dialog>
);
