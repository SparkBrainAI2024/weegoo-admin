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
