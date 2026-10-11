import { gql, TypedDocumentNode } from '@apollo/client';
import { AdminProfile } from 'graphql/queries/admin-profile.queries';

export const UPDATE_ADMIN_PROFILE: TypedDocumentNode<
    { updateAdminProfile: AdminProfile },
    { input: { fullName: string; phone: string | null } }
> = gql`
    mutation UpdateAdminProfile($input: UpdateAdminProfileInput!) {
        updateAdminProfile(input: $input) {
            _id
            fullName
            email
            phone
        }
    }
`;

export const CHANGE_ADMIN_PASSWORD: TypedDocumentNode<
    { changeAdminPassword: { message: string; success: boolean } },
    { input: { currentPassword: string; newPassword: string } }
> = gql`
    mutation ChangeAdminPassword($input: ChangeAdminPasswordInput!) {
        changeAdminPassword(input: $input) {
            message
            success
        }
    }
`;
