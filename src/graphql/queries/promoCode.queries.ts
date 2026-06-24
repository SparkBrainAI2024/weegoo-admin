import { gql } from '@apollo/client';

export const GET_PROMO_CODES = gql`
    query PromoCodes($paginationInput: PromoCodeFindAllInput!) {
        promoCodes(paginationInput: $paginationInput) {
            data {
                _id
                name
                discountType
                percentageAmount
                flatAmount
                maxDiscount
                minimumFare
                appliedTo
                totalUsageLimit
                perUserLimit
                startDateTime
                expiryDateTime
                status
                promoCodeUsedCount
                occasion {
                    _id
                    occasionName
                }
            }
            message
            pagination {
                hasNextPage
                hasPreviousPage
                limit
                nextPage
                previousPage
                total
                page
            }
        }
    }
`;

export const GET_PROMO_CODE = gql`
    query PromoCode($promoCodeId: ID!) {
        promoCode(id: $promoCodeId) {
            _id
            createdAt
            updatedAt
            occasion {
                _id
                occasionName
            }
            name
            discountType
            percentageAmount
            flatAmount
            maxDiscount
            minimumFare
            appliedTo
            totalUsageLimit
            perUserLimit
            startDateTime
            expiryDateTime
            status
            promoCodeUsedCount
        }
    }
`;
