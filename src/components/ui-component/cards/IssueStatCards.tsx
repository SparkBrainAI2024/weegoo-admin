// views/issues/IssueStatCards.tsx
import * as React from 'react';
import Grid from '@mui/material/Grid';
import IssueStatCard from './IssueStatCard';

interface IssueStatCardsProps {
    totalOpen: number;
    totalInReview: number;
    totalResolved: number;
    avgFirstResponse?: string | null;
    avgResolution?: string | null;
    loading?: boolean;
}

const IssueStatCards = ({ totalOpen, totalInReview, totalResolved, avgFirstResponse, avgResolution, loading }: IssueStatCardsProps) => (
    <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
            <IssueStatCard label="Open" value={loading ? '—' : totalOpen} chip="New" chipColor="orange" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
            <IssueStatCard label="In Progress" value={loading ? '—' : totalInReview} chip="Working" chipColor="secondary" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
            <IssueStatCard label="Resolved" value={loading ? '—' : totalResolved} chip="Closed" chipColor="success" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
            <IssueStatCard label="Avg Response Time" value={avgFirstResponse ?? '—'} secondaryValue={avgResolution ?? '—'} />
        </Grid>
    </Grid>
);

export default IssueStatCards;
