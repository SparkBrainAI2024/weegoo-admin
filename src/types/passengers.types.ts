// types/driver.types.ts
export interface PassengerListItem {
    id: string;
    fullName: string;
    phone: string;
    profileImage?: string;
    status: 'ACTIVE' | 'PENDING' | 'BLOCKED';
    suspended: boolean;
    totalTripsAsPassenger: number;
    totalSpendingOnRides: number;
    rating: number;
    joinedDate: string | null;
}

export interface PassengerListInput {
    page: number;
    limit: number;
    search?: string;
    status?: string;
}

export interface RiderOverview {
    id: string;
    fullName: string;
    profileImage?: string;
    phone: string;
    email?: string;
    suspended: boolean;
    joinedDate?: string;
    lastActive?: string;
    phoneVerified?: boolean;
}

export interface TripListItem {
    id: string;
    rideUUId: string;
    createdAt: string;
    pickupLocation?: string;
    dropoffLocation?: string;
    fare: number;
    paymentMethod?: string;
    status: string;
}

export interface RiderTripsSummary {
    totalTrips: number;
    completed: number;
    cancelled: number;
    totalSpend: number;
    avgFare: number;
}

export interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface GetRiderOverviewQueryResult {
    getRiderOverview: RiderOverview;
}

export interface GetRiderTripsQueryResult {
    getRiderTrips: {
        data: TripListItem[];
        summary: RiderTripsSummary;
        pagination: Pagination;
    };
}

export interface RatingBreakdown {
    fiveStar: number;
    fourStar: number;
    threeStar: number;
    twoStar: number;
    oneStar: number;
}

export interface RatingListItem {
    rideId: string;
    rideUUId: string;
    pickup?: string;
    drop?: string;
    fare?: number;
    driverName: string;
    driverShortId?: string;
    createdAt: string;
    rating: number;
    review?: string;
    feedbackTags?: string[];
}

export interface GetRiderRatingsQueryResult {
    getRiderRatings: {
        averageRating: number;
        totalReviews: number;
        breakdown: RatingBreakdown;
        data: RatingListItem[];
        pagination: Pagination;
    };
}
