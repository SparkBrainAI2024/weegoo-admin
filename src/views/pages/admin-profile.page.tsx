import { Alert, Skeleton, Stack, Typography } from '@mui/material';
import { useQuery } from '@apollo/client/react';
import { GET_ADMIN_PROFILE } from 'graphql/queries/admin-profile.queries';
import ProfileHeaderCard from 'components/ui-component/profile/ProfileHeaderCard';
import ProfileInfoCard from 'components/ui-component/profile/ProfileInfoCard';
import ChangePasswordCard from 'components/ui-component/profile/ChangePasswordCard';

export default function AdminProfilePage() {
    const { data, loading, error } = useQuery(GET_ADMIN_PROFILE);

    if (loading && !data) {
        return (
            <Stack gap={3}>
                <Skeleton variant="rounded" height={110} />
                <Skeleton variant="rounded" height={190} />
                <Skeleton variant="rounded" height={230} />
            </Stack>
        );
    }

    if (error || !data) {
        return <Alert severity="error">Couldn&apos;t load your profile{error ? `: ${error.message}` : ''}.</Alert>;
    }

    const profile = data.getAdminProfile;

    return (
        <Stack gap={3}>
            <ProfileHeaderCard fullName={profile.fullName} email={profile.email} phone={profile.phone} />
            <ProfileInfoCard profile={profile} />
            <ChangePasswordCard />
            <Typography variant="caption" color="text.secondary">
                Changes will apply to this account only.
            </Typography>
        </Stack>
    );
}
