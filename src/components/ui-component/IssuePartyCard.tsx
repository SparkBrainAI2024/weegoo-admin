// views/issues/detail/IssuePartyCard.tsx
import * as React from 'react';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import Chip from 'components/ui-component/extended/Chip';
import MainCard from 'components/ui-component/cards/MainCard';
import { IssuePartyInfo } from 'types/issues.types';
import { avatarColorFor, getInitials, maskPhone } from 'utils/issue.utils';

interface IssuePartyCardProps {
    title: 'Reported From' | 'Reported To';
    party: IssuePartyInfo;
    onOpenProfile: (party: IssuePartyInfo) => void;
    /** Only the "Reported To" party gets a Block action in the screenshot */
    onToggleBlock?: (party: IssuePartyInfo) => void;
    blockLoading?: boolean;
}

const IssuePartyCard = ({ title, party, onOpenProfile, onToggleBlock, blockLoading }: IssuePartyCardProps) => {
    const roleLabel = party.role === 'PASSENGER' ? 'Rider' : 'Driver';
    const openLabel = party.role === 'PASSENGER' ? 'Open Rider' : 'Open Driver';

    return (
        <MainCard content={false} sx={{ p: 3, height: '100%' }}>
            <Stack spacing={2.5}>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Typography variant="h5">{title}</Typography>
                    <Chip label={roleLabel} size="small" chipcolor={party.role === 'PASSENGER' ? 'success' : 'secondary'} />
                </Stack>

                <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: avatarColorFor(party.fullName), width: 44, height: 44, fontWeight: 700 }}>
                        {getInitials(party.fullName)}
                    </Avatar>
                    <Stack spacing={0.25}>
                        <Typography variant="subtitle1">{party.fullName}</Typography>
                        <Typography variant="body2" color="textSecondary">
                            {maskPhone(party.phone)}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            ID: {party.displayId}
                        </Typography>
                    </Stack>
                </Stack>

                <Stack direction="row" spacing={1.5}>
                    <Button
                        variant="contained"
                        onClick={() => onOpenProfile(party)}
                        sx={{
                            borderRadius: '8px',
                            bgcolor: 'grey.900',
                            color: 'common.white',
                            '&:hover': { bgcolor: 'grey.800' }
                        }}
                    >
                        {openLabel}
                    </Button>

                    {onToggleBlock && (
                        <Button
                            variant="outlined"
                            color="error"
                            disabled={blockLoading}
                            onClick={() => onToggleBlock(party)}
                            sx={{ borderRadius: '8px' }}
                        >
                            {blockLoading ? 'Processing…' : party.suspended ? 'Unblock User' : 'Block User'}
                        </Button>
                    )}
                </Stack>
            </Stack>
        </MainCard>
    );
};

export default IssuePartyCard;
