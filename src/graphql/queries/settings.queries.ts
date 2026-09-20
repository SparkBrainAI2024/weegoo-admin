import { gql, TypedDocumentNode } from '@apollo/client';

export interface GetAllPricingResult {
    adminRidePricings: VehiclePricing[];
}

// Mocked result for now — swap body for an Apollo query later,
// signature/return shape stays the same

export interface VehiclePricing {
    vehicleType: string;
    commission: number;
    baseFare: number;
    amountPerKm: number;
    amountPerMinute: number;
    isEnabled: boolean;
}

export interface MaintenanceInfo {
    _id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    deleted: boolean;
    message: string;
}

export interface GetMaintenanceInfoResult {
    maintenanceInfo: MaintenanceInfo;
}

export const GET_MAINTENANCE_INFO: TypedDocumentNode<GetMaintenanceInfoResult, Record<string, never>> = gql`
    query MaintenanceInfo {
        maintenanceInfo {
            _id
            createdAt
            updatedAt
            deletedAt
            deleted
            message
        }
    }
`;

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

export interface CompanyInfo {
    _id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    deleted: boolean;
    companyName: string;
    supportEmail: string;
}

export interface GetCompanyInfoResult {
    adminCompanyInfo: CompanyInfo;
}

export const GET_COMPANY_INFO: TypedDocumentNode<GetCompanyInfoResult, Record<string, never>> = gql`
    query AdminCompanyInfo {
        adminCompanyInfo {
            _id
            createdAt
            updatedAt
            deletedAt
            deleted
            companyName
            supportEmail
        }
    }
`;
