export type PromoStatus = 'ACTIVE' | 'INACTIVE' | 'EXPIRED' | 'DRAFT';
export enum PromoStatusEnum {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    EXPIRED = 'EXPIRED',
    DRAFT = 'DRAFT'
}

export type discountType = 'FLAT' | 'PERCENTAGE';
export type appliedTo = 'ALL_RIDES' | 'FIRST_RIDE';
