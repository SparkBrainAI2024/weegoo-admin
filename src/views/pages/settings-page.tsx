import { useState, SyntheticEvent } from 'react';
import { Box, Tabs, Tab, Paper, Typography, Stack, Divider } from '@mui/material';
import CompanyInfoSection from 'components/ui-component/settings/CompanyInfoSection';
import PricingFeesSection from 'components/ui-component/settings/PricingFeesSection';
import MaintenanceSection from 'components/ui-component/settings/MaintenanceSection';
import NotificationsSection from 'components/ui-component/settings/NotificationsSection';
import { SETTINGS_TAB_ICONS } from 'components/ui-component/settings/constants/settingsTabIcons';

const TABS = [
    { label: 'Company Info', value: 'company' },
    { label: 'Pricing & Fees', value: 'pricing' },
    { label: 'Maintenance', value: 'maintenance' },
    { label: 'Notifications', value: 'notifications' }
] as const;

type TabValue = (typeof TABS)[number]['value'];

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<TabValue>('company');

    const handleChange = (_: SyntheticEvent, newValue: TabValue) => setActiveTab(newValue);

    return (
        <Paper
            elevation={0}
            sx={{
                minWidth: 220,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 4
            }}
        >
            <Stack
                direction="row"
                borderRadius={3}
                divider={<Divider orientation="vertical" flexItem />}
                sx={{ alignItems: 'stretch', gap: 3 }}
            >
                {' '}
                <Stack gap={3} padding={2}>
                    <Typography variant="h3">Configuration</Typography>
                    <Tabs
                        orientation="vertical"
                        value={activeTab}
                        onChange={handleChange}
                        sx={{
                            '& .MuiTab-root': { alignItems: 'flex-start', textAlign: 'left', minHeight: 48 },
                            '& .MuiTabs-indicator': { left: 0, right: 'auto', width: 3 }
                        }}
                    >
                        {TABS.map((tab) => {
                            const Icon = SETTINGS_TAB_ICONS[tab.value];
                            return (
                                <Tab
                                    key={tab.value}
                                    value={tab.value}
                                    label={tab.label}
                                    icon={<Icon fontSize="medium" />}
                                    iconPosition="start"
                                />
                            );
                        })}
                    </Tabs>
                </Stack>
                <Box sx={{ flex: 1 }}>
                    {activeTab === 'company' && <CompanyInfoSection />}
                    {activeTab === 'pricing' && <PricingFeesSection />}
                    {activeTab === 'maintenance' && <MaintenanceSection />}
                    {activeTab === 'notifications' && <NotificationsSection />}
                </Box>
            </Stack>
        </Paper>
    );
}
