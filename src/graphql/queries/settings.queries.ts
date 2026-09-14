export interface CompanyInfo {
    companyName: string;
    supportEmail: string;
}

// Mocked result for now — swap body for an Apollo query later,
// signature/return shape stays the same
export async function getCompanyInfo(): Promise<CompanyInfo> {
    return Promise.resolve({
        companyName: 'Ride Hailing Pvt. Ltd.',
        supportEmail: 'support@ridehailing.com'
    });
}
export interface VehiclePricing {
    vehicleType: 'car' | 'bike' | 'auto';
    commission: number;
    baseFare: number;
    amountPerKm: number;
    amountPerMin: number;
}

const MOCK_DB: VehiclePricing[] = [
    { vehicleType: 'car', commission: 10, baseFare: 100, amountPerKm: 50, amountPerMin: 5 },
    { vehicleType: 'bike', commission: 8, baseFare: 50, amountPerKm: 20, amountPerMin: 2 },
    { vehicleType: 'auto', commission: 12, baseFare: 70, amountPerKm: 30, amountPerMin: 3 }
];

export async function getPricingFees(): Promise<VehiclePricing[]> {
    return Promise.resolve(MOCK_DB);
}

export interface MaintenanceStatus {
    enabled: boolean;
    message: string;
}

export async function getMaintenanceStatus(): Promise<MaintenanceStatus> {
    return Promise.resolve({
        enabled: false,
        message: 'We are updating the service. Please try again soon.'
    });
}
