//
// Wired to the real API. Ride Details card removed per decision — "Related
// Trip" still shows as a chip inside Basic Information, that's enough.
// reportedTo renders whenever the backend returns one; no frontend branching
// on category/rideId needed, that logic lives server-side now.

import * as React from 'react';

import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import Snackbar from '@mui/material/Snackbar';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

import { useMutation, useQuery } from '@apollo/client/react';
import { GET_ISSUE_DETAIL } from 'graphql/queries/issues.queries';
import { CLOSE_ISSUE, RESOLVE_ISSUE } from 'graphql/mutations/issues.mutations';
import { useCurrentAdminId } from 'hooks/userCurrentAdminId';
import { IssuePartyInfo } from 'types/issues.types';
import IssueDetailHeader from 'components/ui-component/IssueDetailHeader';
import IssueBasicInfoCard from 'components/ui-component/IssueBasicInfoCard';
import IssuePartyCard from 'components/ui-component/IssuePartyCard';
import { useParams } from 'react-router';

interface IssueDetailPageProps {
    issueId: string;
    onBack: () => void;
}

const IssueDetailPage = ({ issueId, onBack }: IssueDetailPageProps) => {
    const { id } = useParams();
    const currentAdminId = useCurrentAdminId();
    const [snackbar, setSnackbar] = React.useState<{ message: string; severity: 'success' | 'error' } | null>(null);

    const { data, loading, error, refetch } = useQuery(GET_ISSUE_DETAIL, {
        variables: {
            input: {
                id: id ?? ''
            }
        },
        skip: !id
    });

    const [resolveIssue, { loading: resolving }] = useMutation(RESOLVE_ISSUE, {
        onCompleted: (res) => {
            refetch();
            setSnackbar({ message: res.resolveIssue.message, severity: 'success' });
        },
        onError: (err) => {
            console.error('resolveIssue failed:', err.message);
            setSnackbar({ message: 'Failed to resolve issue', severity: 'error' });
        }
    });

    const [closeIssue, { loading: closing }] = useMutation(CLOSE_ISSUE, {
        onCompleted: (res) => {
            refetch();
            setSnackbar({ message: res.closeIssue.message, severity: 'success' });
        },
        onError: (err) => {
            console.error('closeIssue failed:', err.message);
            setSnackbar({ message: 'Failed to close issue', severity: 'error' });
        }
    });

    const handleResolve = () => {
        if (!currentAdminId) {
            setSnackbar({ message: 'No admin id available — cannot resolve yet', severity: 'error' });
            return;
        }
        resolveIssue({ variables: { id: issueId, resolvedBy: currentAdminId } });
    };

    const handleClose = () => {
        if (!currentAdminId) {
            setSnackbar({ message: 'No admin id available — cannot close yet', severity: 'error' });
            return;
        }
        closeIssue({ variables: { id: issueId, closedBy: currentAdminId } });
    };

    const handleOpenProfile = (party: IssuePartyInfo) => {
        // TODO: navigate to /drivers/:id or /passengers/:id once those routes are confirmed
        console.log('open profile', party.userId, party.role);
    };

    const handleToggleBlock = (party: IssuePartyInfo) => {
        // TODO: call BLOCK_DRIVER/UNBLOCK_DRIVER when party.role === 'DRIVER',
        // or the equivalent passenger mutation when party.role === 'PASSENGER'
        console.log('toggle block', party.userId, party.role, !party.suspended);
    };

    if (loading && !data) {
        return (
            <Stack spacing={2.5}>
                <Skeleton variant="rounded" height={40} width={320} />
                <Skeleton variant="rounded" height={180} />
                <Skeleton variant="rounded" height={220} />
            </Stack>
        );
    }

    if (error || !data) {
        return <Alert severity="error">Couldn&apos;t load this issue{error ? `: ${error.message}` : ''}.</Alert>;
    }

    const issue = data.getIssueDetail;

    // IssuePartyDetailData -> IssuePartyInfo: same shape, just narrows nullable
    // phone/displayId to the party card's expected type.
    const toPartyInfo = (p: typeof issue.reporter): IssuePartyInfo => ({
        role: p.role,
        fullName: p.fullName,
        phone: p.phone ?? '',
        displayId: p.displayId ?? '—',
        userId: p.userId,
        suspended: p.suspended
    });

    return (
        <Stack spacing={2.5}>
            <IssueDetailHeader
                ticketCode={issue.ticketCode}
                status={issue.status}
                onBack={onBack}
                onResolve={handleResolve}
                onClose={handleClose}
                resolving={resolving}
                closing={closing}
            />

            <IssueBasicInfoCard
                categoryLabel={issue.categoryLabel ?? '—'}
                createdAt={issue.createdAt}
                rideId={issue.rideId.rideUUId}
                priority={issue.priority}
                issueContent={issue.issueContent}
                issueCategoryType={issue.issueCategoryType}
            />

            <Grid container spacing={2.5} alignItems="stretch">
                <Grid item xs={12} md={issue.reportee ? 6 : 12}>
                    <IssuePartyCard title="Reported From" party={toPartyInfo(issue.reporter)} onOpenProfile={handleOpenProfile} />
                </Grid>

                <Grid item xs={12} md={6}>
                    <IssuePartyCard
                        title="Reported To"
                        party={toPartyInfo(issue.reportee)}
                        onOpenProfile={handleOpenProfile}
                        onToggleBlock={handleToggleBlock}
                    />
                </Grid>
            </Grid>

            <Snackbar open={!!snackbar} autoHideDuration={4000} onClose={() => setSnackbar(null)}>
                {snackbar ? (
                    <Alert severity={snackbar.severity} onClose={() => setSnackbar(null)}>
                        {snackbar.message}
                    </Alert>
                ) : undefined}
            </Snackbar>
        </Stack>
    );
};

export default IssueDetailPage;
