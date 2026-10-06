import { lazy } from 'react';

// project imports
import MainLayout from 'components/layout/MainLayout';
import Loadable from 'components/ui-component/Loadable';
import AuthGuard from 'utils/route-guard/AuthGuard';

import NewPage from 'views/pages/create-new-page';
import NewEmailTemplate from 'views/pages/create-email-template';
import { Navigate } from 'react-router';
import CompanyInfoSection from 'components/ui-component/settings/CompanyInfoSection';
import PricingFeesSection from 'components/ui-component/settings/PricingFeesSection';
import MaintenanceSection from 'components/ui-component/settings/MaintenanceSection';
import NotificationsSection from 'components/ui-component/settings/NotificationsSection';
import LocationsSection from 'components/ui-component/settings/locations/LocationSection';
import LocationFormPage from 'components/ui-component/settings/locations/LocationFormPage';
import StationFormPage from 'components/ui-component/settings/locations/StationFormPage';

// dashboard routing

// widget routing
const WidgetChart = Loadable(lazy(() => import('views/widget/Chart')));

const RidesPage = Loadable(lazy(() => import('views/pages/rides-list')));

const DriversPage = Loadable(lazy(() => import('views/pages/drivers-list')));

const PassengersPage = Loadable(lazy(() => import('views/pages/passengers-list')));
const SettingsPage = Loadable(lazy(() => import('views/pages/settings-page')));
const PageManagementPage = Loadable(lazy(() => import('views/pages/page-list')));
const EmailTemplatePage = Loadable(lazy(() => import('views/pages/email-template-list')));
const PaymentsPage = Loadable(lazy(() => import('views/pages/payments')));
const ReportsPage = Loadable(lazy(() => import('views/pages/reports')));
const OffersPage = Loadable(lazy(() => import('views/pages/offers')));
const OffersDetailsPage = Loadable(lazy(() => import('views/pages/offers-detail')));
const IssueDetailPage = Loadable(lazy(() => import('views/pages/issue.detail.page')));
const DriverDetailsPage = Loadable(lazy(() => import('views/pages/driver-detail.page')));
const RideDetailsPage = Loadable(lazy(() => import('views/pages/ride-details')));
const PassengerDetailsPage = Loadable(lazy(() => import('views/pages/passenger-detail.page')));

const DashboardPage = Loadable(lazy(() => import('views/pages/dashboard')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/',
    element: (
        <AuthGuard>
            <MainLayout />
        </AuthGuard>
    ),
    children: [
        {
            path: '/dashboard/default',
            element: <DashboardPage />
        },
        {
            path: '/rides',
            element: <RidesPage />
        },
        {
            path: '/drivers',
            element: <DriversPage />
        },
        {
            path: '/passengers',
            element: <PassengersPage />
        },
        {
            path: '/payments',
            element: <PaymentsPage />
        },
        {
            path: '/offers',
            element: <OffersPage />
        },
        {
            path: '/offers/:id',
            element: <OffersDetailsPage />
        },
        {
            path: '/drivers/:id',
            element: <DriverDetailsPage />
        },
        {
            path: '/rides/:id',
            element: <RideDetailsPage />
        },

        {
            path: '/passengers/:riderId',
            element: <PassengerDetailsPage />
        },
        {
            path: '/reports',
            element: <ReportsPage />
        },
        {
            path: '/reports/:id',
            element: <IssueDetailPage />
        },
        {
            path: '/settings',
            element: <SettingsPage />,
            children: [
                { index: true, element: <Navigate to="/settings/company" replace /> },
                { path: 'company', element: <CompanyInfoSection /> },
                { path: 'pricing', element: <PricingFeesSection /> },
                { path: 'maintenance', element: <MaintenanceSection /> },
                { path: 'notifications', element: <NotificationsSection /> },
                { path: 'location', element: <LocationsSection /> },
                { path: 'location/new', element: <LocationFormPage /> },
                { path: 'location/:locationId/edit', element: <LocationFormPage /> },
                { path: 'location/:locationId/stations/new', element: <StationFormPage /> },
                { path: 'location/:locationId/stations/:stationId/edit', element: <StationFormPage /> }
            ]
        },
        {
            path: '/page-management',
            element: <PageManagementPage />
        },
        {
            path: '/page-management/:slug/edit',
            element: <NewPage />
        },
        {
            path: '/page-management/add',
            element: <NewPage />
        },
        {
            path: '/email-template',
            element: <EmailTemplatePage />
        },
        {
            path: '/email-template/:id/edit',
            element: <NewEmailTemplate />
        },
        {
            path: '/email-template/add',
            element: <NewEmailTemplate />
        },

        {
            path: '/widget/chart',
            element: <WidgetChart />
        }
    ]
};

export default MainRoutes;
