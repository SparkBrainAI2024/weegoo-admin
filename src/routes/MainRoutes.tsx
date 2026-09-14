import { lazy } from 'react';

// project imports
import MainLayout from 'components/layout/MainLayout';
import Loadable from 'components/ui-component/Loadable';
import AuthGuard from 'utils/route-guard/AuthGuard';

import NewPage from 'views/pages/create-new-page';
import NewEmailTemplate from 'views/pages/create-email-template';

// dashboard routing

// widget routing
const WidgetStatistics = Loadable(lazy(() => import('views/widget/Statistics')));
const WidgetData = Loadable(lazy(() => import('views/widget/Data')));
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
            element: <SettingsPage />
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
            path: '/widget/statistics',
            element: <WidgetStatistics />
        },
        {
            path: '/widget/data',
            element: <WidgetData />
        },
        {
            path: '/widget/chart',
            element: <WidgetChart />
        }
    ]
};

export default MainRoutes;
