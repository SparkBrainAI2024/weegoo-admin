import { gql } from '@apollo/client';

export const CREATE_PROMO_CODE = gql`
    mutation CreatePromoCode($input: CreatePromoCodeInput!) {
        createPromoCode(input: $input) {
            success
            message
            promocode {
                _id
                name
                discountType
            }
        }
    }
`;

export const UPDATE_PROMO_CODE = gql`
    mutation updatePromoCode($updatePromoCodeId: ID!, $input: UpdatePromoCodeInput!) {
        updatePromoCode(id: $updatePromoCodeId, input: $input) {
            success
            message
            promocode {
                _id
                name
                discountType
            }
        }
    }
`;

export const ACTIVATE_PROMO_CODE = gql`
    mutation ActivatePromoCode($activatePromoCodeId: ID!) {
        activatePromoCode(id: $activatePromoCodeId) {
            _id
            status
        }
    }
`;
