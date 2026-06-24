import { gql } from '@apollo/client';

export const CREATE_PROMO_CODE = gql`
    mutation CreatePromoCode($input: CreatePromoCodeInput!) {
        createPromoCode(input: $input) {
            _id
            name
            status
        }
    }
`;

export const UPDATE_PROMO_CODE = gql`
    mutation UpdatePromoCode($updatePromoCodeId: ID!, $input: UpdatePromoCodeInput!) {
        updatePromoCode(id: $updatePromoCodeId, input: $input) {
            _id
            name
            status
        }
    }
`;
