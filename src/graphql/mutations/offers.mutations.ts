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
