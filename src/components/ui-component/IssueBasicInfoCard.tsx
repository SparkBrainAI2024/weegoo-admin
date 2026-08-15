// views/issues/detail/IssueBasicInfoCard.tsx
import * as React from 'react';

import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { IssuePriority } from 'types/issues.types';
import { formatTicketDate, priorityMeta } from 'utils/issue.utils';
import ShadowedCardContainer from './cards/ShadowedContainer';
import { SpaciousChipContainer } from './SpaciousChipContainer';

interface IssueBasicInfoCardProps {
    categoryLabel: string;
    createdAt: string;
    rideId?: string | null;
    priority: IssuePriority;
    issueContent: string;
    issueCategoryType: string;
}

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <Stack spacing={0.75}>
        <Typography
            variant="body1"
            color="textSecondary"
            sx={{
                fontWeight: 500,
                letterSpacing: 0.4
            }}
        >
            {label}
        </Typography>

        {children}
    </Stack>
);

const IssueBasicInfoCard = ({ categoryLabel, createdAt, rideId, priority, issueContent, issueCategoryType }: IssueBasicInfoCardProps) => {
    const p = priorityMeta[priority];

    return (
        <ShadowedCardContainer>
            <CardContent>
                <Stack>
                    {/* Basic details */}
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Typography
                                variant="subtitle1"
                                color="textSecondary"
                                sx={{
                                    fontWeight: 500,
                                    letterSpacing: 0.4
                                }}
                            >
                                Basic Information
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Field label="Category">
                                <Typography variant="subtitle1" fontWeight={500}>
                                    {issueCategoryType}
                                </Typography>
                            </Field>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <Field label="Created At">
                                <Typography variant="subtitle1" fontWeight={500}>
                                    {formatTicketDate(createdAt)}
                                </Typography>
                            </Field>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <Field label="Related Trip">
                                {rideId ? (
                                    <SpaciousChipContainer color="secondary" label={rideId}></SpaciousChipContainer>
                                ) : (
                                    <Typography variant="subtitle1" color="textSecondary">
                                        —
                                    </Typography>
                                )}
                            </Field>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <Field label="Priority">
                                <SpaciousChipContainer color={p.color} label={p.label}></SpaciousChipContainer>
                            </Field>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Stack
                                spacing={1}
                                sx={{
                                    pt: 2.5,
                                    borderTop: '1px solid',
                                    borderColor: 'divider'
                                }}
                            >
                                <Typography
                                    variant="caption"
                                    color="textSecondary"
                                    sx={{
                                        fontWeight: 500,
                                        textTransform: 'uppercase',
                                        letterSpacing: 0.4
                                    }}
                                >
                                    Description
                                </Typography>

                                <Stack spacing={0.75}>
                                    <Typography variant="body2" color="textSecondary" fontWeight={500}>
                                        {categoryLabel}
                                    </Typography>

                                    <Typography variant="body2" color="textSecondary">
                                        {issueContent}
                                    </Typography>
                                </Stack>
                            </Stack>
                        </Grid>
                    </Grid>

                    {/* Description */}
                </Stack>
            </CardContent>
        </ShadowedCardContainer>
    );
};

export default IssueBasicInfoCard;
