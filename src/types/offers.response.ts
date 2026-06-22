
interface CreatePromoCodeResponse {
    createPromoCode: {
        _id: string;
        name: string;
        status: string;
    }
}

interface CreatePromoCodeInput {
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