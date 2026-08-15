import { useMutation } from '@apollo/client/react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, CircularProgress } from '@mui/material';

import { BLOCK_DRIVER, UNBLOCK_DRIVER } from 'graphql/mutations/driver.mutation';
import { DriverListItem } from 'types/drivers.types';
import { CurrentUserToBlock } from 'views/pages/issue.detail.page';

interface BlockUnblockDriverDialogProps {
    driver: DriverListItem | CurrentUserToBlock;
    onClose: () => void;
    refetch: () => void; // pass this down from the parent's useQuery
    showSuccess: (message: string) => void;
    showError: (message: string) => void;
}

export function BlockUnblockDriverDialog({ driver, onClose, refetch, showSuccess, showError }: BlockUnblockDriverDialogProps) {
    const [blockDriver, { loading: blocking }] = useMutation(BLOCK_DRIVER, {
        onCompleted: () => {
            onClose();
            refetch(); // re-runs the list query so the ACTIVE-tab filter excludes this row
            showSuccess('Driver blocked successfully');
        },
        onError: (err) => {
            console.log('BlockDriver failed:', err.message);
            showError('Failed to block driver');
        }
    });

    const [unblockDriver, { loading: unblocking }] = useMutation(UNBLOCK_DRIVER, {
        onCompleted: () => {
            onClose();
            refetch();
            showSuccess('Driver unblocked successfully');
        },
        onError: (err) => {
            console.log('UnblockDriver failed:', err.message);
            showError('Failed to unblock driver');
        }
    });

    const loading = blocking || unblocking;

    const isCurrentlyBlocked = driver.suspended;
    const actionLabel = isCurrentlyBlocked ? 'Unblock' : 'Block';

    const handleConfirm = async () => {
        try {
            if (isCurrentlyBlocked) {
                await unblockDriver({ variables: { id: driver.id } });
            } else {
                await blockDriver({ variables: { id: driver.id } });
            }
            // onClose + refetch now happen in onCompleted above,
            // so they run only after the mutation actually succeeds
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Dialog open onClose={loading ? undefined : onClose} maxWidth="xs" fullWidth>
            <DialogTitle>{actionLabel} Driver</DialogTitle>

            <DialogContent>
                <DialogContentText>
                    Are you sure you want to <strong>{actionLabel.toLowerCase()}</strong> <strong>{driver.fullName}</strong>?
                    {!isCurrentlyBlocked && <> This driver will not be able to accept new rides while blocked.</>}
                </DialogContentText>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} disabled={loading}>
                    Cancel
                </Button>

                <Button
                    onClick={handleConfirm}
                    variant="contained"
                    color={isCurrentlyBlocked ? 'success' : 'error'}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
                >
                    {loading ? 'Processing...' : actionLabel}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
