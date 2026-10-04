import { useState, SyntheticEvent } from 'react';
import { Box, Tabs, Tab, Paper, Typography, Stack, Divider } from '@mui/material';
import CompanyInfoSection from 'components/ui-component/settings/CompanyInfoSection';
import PricingFeesSection from 'components/ui-component/settings/PricingFeesSection';
import MaintenanceSection from 'components/ui-component/settings/MaintenanceSection';
import NotificationsSection from 'components/ui-component/settings/NotificationsSection';
import { SETTINGS_TAB_ICONS } from 'components/ui-component/settings/constants/settingsTabIcons';
import LocationsSection from 'components/ui-component/settings/locations/LocationSection';

const TABS = [
    { label: 'Company Information', value: 'company' },
    { label: 'Pricing & Fees', value: 'pricing' },
    { label: 'Maintenance Mode', value: 'maintenance' },
    { label: 'Push Notifications', value: 'notifications' },
    { label: 'Locations & Bus Stations', value: 'location' }
] as const;

type TabValue = (typeof TABS)[number]['value'];

const SettingsPage = () => {
    const [activeTab, setActiveTab] = useState<TabValue>('company');

    const handleChange = (_: SyntheticEvent, newValue: TabValue) => setActiveTab(newValue);

    return (
        <Paper
            elevation={0}
            sx={{
                minWidth: 220,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 4,
                paddingX: 2.5
            }}
        >
            <Stack
                direction="row"
                borderRadius={3}
                divider={<Divider orientation="vertical" flexItem />}
                sx={{ alignItems: 'stretch', gap: 1 }}
            >
                <Stack gap={2} paddingY={2}>
                    <Typography variant="h4">Configuration</Typography>
                    <Tabs
                        orientation="vertical"
                        value={activeTab}
                        onChange={handleChange}
                        sx={{
                            '& .MuiTab-root': {
                                alignItems: 'flex-center',
                                justifyContent: 'flex-start',
                                textAlign: 'left',
                                minHeight: 48
                            },
                            '& .MuiTab-root + .MuiTab-root': {
                                marginTop: '8px'
                            },

                            '& .MuiTabs-indicator': {
                                left: 0,
                                right: 'auto',
                                width: 3
                            }
                        }}
                    >
                        {TABS.map((tab) => {
                            const Icon = SETTINGS_TAB_ICONS[tab.value];
                            return (
                                <Tab
                                    sx={{
                                        fontSize: '0.75rem'
                                    }}
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
                    {activeTab === 'location' && <LocationsSection />}
                </Box>
            </Stack>
        </Paper>
    );
};
export default SettingsPage;
