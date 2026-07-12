// types/driver.types.ts
export interface DriverListItem {
    id: string;
    fullName: string;
    phone: string;
    profileImage?: string;
    status: 'ACTIVE' | 'PENDING' | 'BLOCKED';
    suspended: boolean;
    totalRidesAsDriver: number;
    totalEarnings: number;
    rating: number;
    joinedDate: string | null;
}
export interface DriverDetailItem {
    id: string;
    fullName: string;
    phone: string;
    profileImage?: string | undefined;
    status: 'ACTIVE' | 'PENDING' | 'BLOCKED';
    suspended: boolean;
    totalRidesAsDriver: number;
    totalEarnings: number;
    rating: number;
    joinedDate: string | null;
    addrss: string | null;
    email: string | null;
    dateOfBirth: string | null;
    amountDueToCompany: number | null;
    lastTripAt: string | null;
    lastTripStartTime: string | null;
    lastTripEndTime: string | null;
    lastTripDuration: number | null;
}

export interface DriverListInput {
    page: number;
    limit: number;
    search?: string;
    status?: string;
}
