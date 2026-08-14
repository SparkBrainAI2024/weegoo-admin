// views/issues/detail/IssueBasicInfoCard.tsx
import * as React from 'react';

import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import Chip from 'components/ui-component/extended/Chip';
import MainCard from 'components/ui-component/cards/MainCard';

import { IssuePriority } from 'types/issues.types';
import { formatTicketDate, priorityMeta } from 'utils/issue.utils';

interface IssueBasicInfoCardProps {
    categoryLabel: string;
    createdAt: string;
    rideId?: string | null;
    priority: IssuePriority;
    description: string;
}

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <Stack spacing={0.5}>
        <Typography variant="caption" color="textSecondary">
            {label}
        </Typography>
        {children}
    </Stack>
);

const IssueBasicInfoCard = ({ categoryLabel, createdAt, rideId, priority, description }: IssueBasicInfoCardProps) => {
    const p = priorityMeta[priority];

    return (
        <MainCard content={false} sx={{ p: 3 }}>
            <Stack spacing={3}>
                <Typography variant="h5">Basic Information</Typography>

                <Grid container spacing={3}>
                    <Grid item xs={6} sm={3}>
                        <Field label="Category">
                            <Typography variant="subtitle1">{categoryLabel}</Typography>
                        </Field>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <Field label="Created At">
                            <Typography variant="subtitle1">{formatTicketDate(createdAt)}</Typography>
                        </Field>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <Field label="Related Trip">
                            {rideId ? (
                                <Chip label={rideId} size="small" chipcolor="secondary" />
                            ) : (
                                <Typography color="textSecondary">—</Typography>
                            )}
                        </Field>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <Field label="Priority">
                            <Chip label={p.label} size="small" chipcolor={p.color} />
                        </Field>
                    </Grid>
                </Grid>

                <Field label="Description">
                    <Typography variant="body1">{description}</Typography>
                </Field>
            </Stack>
        </MainCard>
    );
};

export default IssueBasicInfoCard;
