// ui-component/cards/IssueStatCard.tsx
import * as React from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import Chip from 'components/ui-component/extended/Chip';
import ShadowedCardContainer from './ShadowedContainer';

interface IssueStatCardProps {
    label: string;
    value: string | number;
    /** Optional pill next to the label, e.g. "New" / "Working" / "Closed" */
    chip?: string;
    chipColor?: 'primary' | 'secondary' | 'success' | 'orange' | 'error';
    /** Optional second value shown alongside the main one (used for Avg Response Time) */
    secondaryValue?: string | number;
    secondaryLabel?: string;
}

const IssueStatCard = ({ label, value, chip, chipColor = 'orange', secondaryValue, secondaryLabel }: IssueStatCardProps) => (
    <ShadowedCardContainer>
        <Box sx={{ p: 2.5 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
                <Typography variant="subtitle2" color="textSecondary">
                    {label}
                </Typography>
                {chip && <Chip label={chip} size="small" chipcolor={chipColor} />}
            </Stack>

            {secondaryValue !== undefined ? (
                <Stack direction="row" spacing={2} alignItems="baseline">
                    <Typography variant="h3">{value}</Typography>
                    <Typography variant="h3">{secondaryValue}</Typography>
                </Stack>
            ) : (
                <Typography variant="h3">{value}</Typography>
            )}
        </Box>
    </ShadowedCardContainer>
);

export default IssueStatCard;
