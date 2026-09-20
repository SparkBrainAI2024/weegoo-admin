import { CompanyInfo, MaintenanceStatus, VehiclePricing } from 'graphql/queries/settings.queries';
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
