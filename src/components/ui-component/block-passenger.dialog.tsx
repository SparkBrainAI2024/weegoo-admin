import { useMutation } from '@apollo/client/react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, CircularProgress } from '@mui/material';

import { BLOCK_PASSENGER, UNBLOCK_PASSENGER } from 'graphql/mutations/passenger.mutation';
import { PassengerListItem } from 'types/passengers.types';
import { CurrentUserToBlock } from 'views/pages/issue.detail.page';

interface BlockUnblockPassengerDialogProps {
    passenger: PassengerListItem | CurrentUserToBlock;
    onClose: () => void;
    refetch: () => void; // pass this down from the parent's useQuery
}

export function BlockUnblockPassengerDialog({ passenger, onClose, refetch }: BlockUnblockPassengerDialogProps) {
    const [blockPassenger, { loading: blocking }] = useMutation(BLOCK_PASSENGER, {
        onCompleted: () => {
            onClose();
            refetch(); // re-runs the list query so the ACTIVE-tab filter excludes this row
        },
        onError: (err) => {
            console.log('Block Passenger failed:', err.message);
        }
    });

    const [unblockPassenger, { loading: unblocking }] = useMutation(UNBLOCK_PASSENGER, {
        onCompleted: () => {
            onClose();
            refetch();
        },
        onError: (err) => {
            console.log('UnblockDriver failed:', err.message);
        }
    });

    const loading = blocking || unblocking;

    const isCurrentlyBlocked = passenger.suspended;
    const actionLabel = isCurrentlyBlocked ? 'Unblock' : 'Block';

    const handleConfirm = async () => {
        try {
            if (isCurrentlyBlocked) {
                await unblockPassenger({ variables: { id: passenger.id } });
            } else {
                await blockPassenger({ variables: { id: passenger.id } });
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
                    Are you sure you want to <strong>{actionLabel.toLowerCase()}</strong> <strong>{passenger.fullName}</strong>?
                    {!isCurrentlyBlocked && <> This passenger will not be able to accept new rides while blocked.</>}
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
