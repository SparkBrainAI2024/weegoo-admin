// views/issues/IssueStatCards.tsx
import * as React from 'react';
import Grid from '@mui/material/Grid';
import IssueStatCard from './IssueStatCard';
import { IssueStats } from 'types/issues.types';

interface IssueStatCardsProps {
    stats: IssueStats;
}

const IssueStatCards = ({ stats }: IssueStatCardsProps) => (
    <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
            <IssueStatCard label="Open" value={stats.open} chip="New" chipColor="orange" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
            <IssueStatCard label="In Progress" value={stats.inProgress} chip="Working" chipColor="secondary" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
            <IssueStatCard label="Resolved" value={stats.resolved} chip="Closed" chipColor="success" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
            <IssueStatCard label="Avg Response Time" value={stats.avgFirstResponse} secondaryValue={stats.avgResolution} />
        </Grid>
    </Grid>
);

export default IssueStatCards;
