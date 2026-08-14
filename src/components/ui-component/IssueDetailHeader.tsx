// views/issues/detail/IssueDetailHeader.tsx
import * as React from 'react';

import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import Chip from 'components/ui-component/extended/Chip';
import { IssueStatus } from 'types/issues.types';
import { statusMeta } from 'utils/issue.utils';

interface IssueDetailHeaderProps {
    ticketCode: string;
    status: IssueStatus;
    onBack: () => void;
    onResolve: () => void;
    onClose: () => void;
    resolving?: boolean;
    closing?: boolean;
}

const IssueDetailHeader = ({ ticketCode, status, onBack, onResolve, onClose, resolving, closing }: IssueDetailHeaderProps) => {
    const meta = statusMeta[status];
    const alreadyResolved = status === IssueStatus.RESOLVED;
    const alreadyClosed = status === IssueStatus.CLOSED;

    return (
        <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            spacing={2}
        >
            <Stack direction="row" alignItems="center" spacing={1.5} flexWrap="wrap">
                <Button startIcon={<ArrowBackIcon />} onClick={onBack} sx={{ borderRadius: '8px' }} variant="outlined" size="small">
                    Back
                </Button>
                <Typography color="textSecondary">Reports /</Typography>
                <Typography variant="h5">{ticketCode}</Typography>
                <Chip label={meta.label} size="small" chipcolor={meta.color} />
            </Stack>

            <Stack direction="row" spacing={1.5}>
                <Button variant="outlined" onClick={onClose} disabled={alreadyClosed || closing} sx={{ borderRadius: '8px' }}>
                    {alreadyClosed ? 'Closed' : closing ? 'Closing…' : 'Close'}
                </Button>
                <Button
                    variant="contained"
                    onClick={onResolve}
                    disabled={alreadyResolved || alreadyClosed || resolving}
                    startIcon={resolving ? <CircularProgress size={16} color="inherit" /> : null}
                    sx={{
                        borderRadius: '8px',
                        bgcolor: 'warning.main',
                        color: 'common.white',
                        '&:hover': { bgcolor: 'warning.dark' }
                    }}
                >
                    {alreadyResolved ? 'Resolved' : resolving ? 'Resolving…' : 'Resolve'}
                </Button>
            </Stack>
        </Stack>
    );
};

export default IssueDetailHeader;
