import { CompanyInfo, MaintenanceInfo, MaintenanceStatus, VehiclePricing } from 'graphql/queries/settings.queries';

import { gql, TypedDocumentNode } from '@apollo/client';
export async function updateCompanyInfo(input: CompanyInfo): Promise<CompanyInfo> {
    // Mocked — pretend the server accepted it
    return Promise.resolve(input);
}

export interface UpsertPricingInput {
    vehicleType: string;
    commission: number;
    baseFare: number;
    amountPerKm: number;
    amountPerMinute: number;
    isEnabled: boolean;
}

export interface BulkUpsertPricingResult {
    upsertAdminRidePricings: VehiclePricing[];
}

export interface BulkUpsertPricingVars {
    input: { pricingList: UpsertPricingInput[] };
}

export const BULK_UPSERT_PRICING: TypedDocumentNode<BulkUpsertPricingResult, BulkUpsertPricingVars> = gql`
    mutation UpsertAdminRidePricings($input: BulkUpsertAdminRidePricingInput!) {
        upsertAdminRidePricings(input: $input) {
            vehicleType
            commission
            baseFare
            amountPerKm
            amountPerMinute
            isEnabled
        }
    }
`;

export async function updateMaintenanceStatus(input: MaintenanceStatus): Promise<MaintenanceStatus> {
    return Promise.resolve(input);
}
export type NotificationAudience = 'riders' | 'drivers' | 'both';

export interface BroadcastNotificationInput {
    audience: NotificationAudience;
    title: string;
    message: string;
}

export async function sendBroadcastNotification(input: BroadcastNotificationInput): Promise<{ success: boolean; sentAt: string }> {
    return Promise.resolve({ success: true, sentAt: new Date().toISOString() });
}

export interface UpsertCompanyInfoInput {
    companyName: string;
    supportEmail: string;
}

export interface UpsertCompanyInfoResult {
    upsertAdminCompanyInfo: CompanyInfo;
}

export interface UpsertCompanyInfoVars {
    input: UpsertCompanyInfoInput;
}

export const UPSERT_COMPANY_INFO: TypedDocumentNode<UpsertCompanyInfoResult, UpsertCompanyInfoVars> = gql`
    mutation UpsertAdminCompanyInfo($input: UpsertAdminCompanyInfoInput!) {
        upsertAdminCompanyInfo(input: $input) {
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

export interface UpsertMaintenanceInfoInput {
    message: string;
}

export interface UpsertMaintenanceInfoResult {
    upsertMaintenanceInfo: MaintenanceInfo;
}

export interface UpsertMaintenanceInfoVars {
    input: UpsertMaintenanceInfoInput;
}

export const UPSERT_MAINTENANCE_INFO: TypedDocumentNode<UpsertMaintenanceInfoResult, UpsertMaintenanceInfoVars> = gql`
    mutation UpsertMaintenanceInfo($input: UpsertMaintenanceInfoInput!) {
        upsertMaintenanceInfo(input: $input) {
            _id
            createdAt
            updatedAt
            deletedAt
            deleted
            message
        }
    }
`;

export enum PushNotificationTarget {
    USER = 'USER',
    DRIVER = 'DRIVER',
    ALL = 'ALL'
}

export interface SendPushNotificationInput {
    target: PushNotificationTarget;
    title: string;
    message: string;
}

export interface SendPushNotificationResult {
    sendPushNotification: {
        success: boolean;
        notifiedCount: number;
    };
}

export interface SendPushNotificationVars {
    input: SendPushNotificationInput;
}

export const SEND_PUSH_NOTIFICATION: TypedDocumentNode<SendPushNotificationResult, SendPushNotificationVars> = gql`
    mutation SendPushNotification($input: SendPushNotificationInput!) {
        sendPushNotification(input: $input) {
            success
            notifiedCount
        }
    }
`;
