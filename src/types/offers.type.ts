import { PromoStatus } from 'constants/enum';

export interface CreatePromoCodeResponse {
    createPromoCode: {
        _id: string;
        name: string;
        status: string;
    };
}

export interface CreatePromoCodeInput {
    name: string;
    discountType: 'PERCENTAGE' | 'FLAT';
    percentageAmount?: number;
    flatAmount?: number;
    maxDiscount?: number;
    minimumFare: number;
    appliedTo: 'ALL_RIDES' | 'FIRST_RIDE';
    totalUsageLimit: number;
    perUserLimit: number;
    startDateTime: string;
    expiryDateTime: string;
    occasionId: string;
}

export interface PromoCode {
    _id: string;
    name: string;
    discountType: 'FLAT' | 'PERCENTAGE';
    percentageAmount: number | null;
    flatAmount: number | null;
    maxDiscount: number | null;
    minimumFare: number;
    appliedTo: string;
    totalUsageLimit: number;
    perUserLimit: number;
    startDateTime: string;
    expiryDateTime: string;
    status: PromoStatus;
    promoCodeUsedCount: number;
}

export interface PromoCodesResponse {
    promoCodes: {
        data: PromoCode[];
        message: string | null;
        pagination: {
            hasNextPage: boolean;
            hasPreviousPage: boolean;
            limit: number;
            total: number;
            page: number;
        };
    };
}

// ==============================|| HELPERS ||============================== //

export const STATUS_COLORS: Record<PromoStatus, { bg: string; text: string }> = {
    DRAFT: { bg: '#FFF8E1', text: '#F9A825' },
    ACTIVE: { bg: '#BFE6C4', text: '#30B010' },
    DISABLED: { bg: '#E0E0E0', text: '#616161' },
    EXPIRED: { bg: '#E0E0E0', text: '#616161' }
};
