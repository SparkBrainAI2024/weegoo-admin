import {  gql } from '@apollo/client';

export const CREATE_PROMO_CODE = gql`
    mutation CreatePromoCode($input: CreatePromoCodeInput!) {
        createPromoCode(input: $input) {
            _id
            name
            status
        }
    }
`;