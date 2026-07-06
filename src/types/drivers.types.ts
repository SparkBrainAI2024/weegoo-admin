// types/driver.types.ts
export interface DriverListItem {
    id: string;
    fullName: string;
    phone: string;
    profileImage?: string;
    status: 'ACTIVE' | 'PENDING' | 'BLOCKED';
    suspended: boolean;
    totalRides: number;
    totalEarnings: number;
    rating: number;
    joinedDate: string | null;
}

export interface DriverListInput {
    page: number;
    limit: number;
    search?: string;
    status?: string;
}
