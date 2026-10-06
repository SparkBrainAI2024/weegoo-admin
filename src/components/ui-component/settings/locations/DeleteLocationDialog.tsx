// DeleteLocationDialog.tsx
import useNotification from 'hooks/useNotification';

import ConfirmDeleteDialog from './ConfirmDeleteDialog';
import { useRemoveLocation } from 'hooks/useRemoveLocation';
import { LocationDetail } from 'graphql/queries/locations.queries';

interface Props {
    location: LocationDetail;
    onClose: () => void;
    onDeleted: () => void;
}

export default function DeleteLocationDialog({ location, onClose, onDeleted }: Props) {
    const { removeLocation } = useRemoveLocation();
    const { showSuccess, showError } = useNotification();

    return (
        <ConfirmDeleteDialog
            title="Delete Location"
            message={
                <>
                    Are you sure you want to delete <strong>{location.name}</strong>?
                </>
            }
            onClose={onClose}
            onConfirm={async () => {
                try {
                    await removeLocation(location._id);
                    showSuccess('Location deleted successfully');
                    onDeleted();
                } catch (err) {
                    console.error(err);
                    showError('Failed to delete location');
                    throw err;
                }
            }}
        />
    );
}
