import { CompanyInfo, MaintenanceStatus, VehiclePricing } from 'graphql/queries/settings.queries';

export async function updateCompanyInfo(input: CompanyInfo): Promise<CompanyInfo> {
    // Mocked — pretend the server accepted it
    return Promise.resolve(input);
}

export async function updatePricingFees(input: VehiclePricing): Promise<VehiclePricing> {
    // Mocked — pretend the server saved this one vehicle type's config
    return Promise.resolve(input);
}

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
