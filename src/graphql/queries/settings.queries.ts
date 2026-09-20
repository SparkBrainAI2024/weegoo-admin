import { gql } from '@apollo/client';
export interface CompanyInfo {
    companyName: string;
    supportEmail: string;
}
export interface GetAllPricingResult {
    adminRidePricings: VehiclePricing[];
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
    vehicleType: string;
    commission: number;
    baseFare: number;
    amountPerKm: number;
    amountPerMinute: number;
    isEnabled: boolean;
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

export const GET_ALL_PRICING = gql`
    query AdminRidePricings {
        adminRidePricings {
            vehicleType
            commission
            baseFare
            amountPerKm
            amountPerMinute
            isEnabled
        }
    }
`;
