import { gql, TypedDocumentNode } from '@apollo/client';

export interface AdminProfile {
    _id: string;
    fullName: string;
    email: string;
    phone?: string | null;
}

export interface GetAdminProfileData {
    getAdminProfile: AdminProfile;
}

export const GET_ADMIN_PROFILE: TypedDocumentNode<GetAdminProfileData> = gql`
    query GetAdminProfile {
        getAdminProfile {
            _id
            fullName
            email
            phone
        }
    }
`;
