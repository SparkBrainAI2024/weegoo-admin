// DeleteStationDialog.tsx
import useNotification from 'hooks/useNotification';

import ConfirmDeleteDialog from './ConfirmDeleteDialog';
import { useRemoveSubLocation } from 'hooks/useRemoveSubLocation';
import { SubLocation } from 'graphql/queries/locations.queries';

interface Props {
    locationId: string;
    station: SubLocation;
    onClose: () => void;
}

export default function DeleteStationDialog({ locationId, station, onClose }: Props) {
    const { removeSubLocation } = useRemoveSubLocation();
    const { showSuccess, showError } = useNotification();

    return (
        <ConfirmDeleteDialog
            title="Delete Bus Station"
            message={
                <>
                    Are you sure you want to delete <strong>{station.address}</strong>?
                </>
            }
            onClose={onClose}
            onConfirm={async () => {
                try {
                    await removeSubLocation(locationId, station._id);
                    showSuccess('Bus station deleted successfully');
                } catch (err) {
                    console.error(err);
                    showError('Failed to delete bus station');
                    throw err;
                }
            }}
        />
    );
}
