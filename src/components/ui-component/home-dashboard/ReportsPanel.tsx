// components/dashboard/ReportsPanel.tsx
import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';
import MuiLink from '@mui/material/Link';
import { Link as RouterLink } from 'react-router-dom';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';
import { HighPriorityIssueItem, useHighPriorityIssues } from 'graphql/queries/home-dashboard.queries';
import { Icon } from '@mui/material';
import ReportsIcon from '../../../assets/images/icons/reports.png';

// Maps backend categoryLabel -> icon + color. Fallback covers any category
// value not explicitly known — categoryLabel is a free-form backend string.
const CATEGORY_STYLE: Record<string, { icon: React.ReactNode; color: string }> = {
    MEDIUM: { icon: <WarningAmberIcon fontSize="small" />, color: 'warning' },
    HIGH: { icon: <ReportProblemIcon fontSize="small" />, color: 'error' },
    LOW: { icon: <HeadsetMicIcon fontSize="small" />, color: 'error' }
};

const DEFAULT_STYLE = { icon: <WarningAmberIcon fontSize="small" />, color: 'warning.' as const };

const ReportRow = ({ item }: { item: HighPriorityIssueItem }) => {
    const style = CATEGORY_STYLE[item.priority] ?? DEFAULT_STYLE;

    return (
        <Stack
            direction="row"
            alignItems="center"
            spacing={1.5}
            sx={{
                py: 1,
                pl: 1.5,
                borderLeft: 4,
                bgcolor: `${style.color}.light`,
                borderColor: `${style.color}.main`,
                borderRadius: 2.5 // rounds the left edge's top/bottom corners, same idea as the card's top corners
            }}
        >
            <Box
                sx={{
                    width: 32,
                    height: 32,
                    borderRadius: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: `${style.color}.lighter`,
                    color: `${style.color}.dark`,
                    flexShrink: 0
                }}
            >
                {style.icon}
            </Box>
            <Typography variant="body2" sx={{ flexGrow: 1 }} noWrap title={item.issueContent}>
                {item.issueContent}
            </Typography>
        </Stack>
    );
};

const ReportsPanel = () => {
    const { data, loading, error } = useHighPriorityIssues();

    if (error) {
        return <Alert severity="error">Failed to load reports: {error.message}</Alert>;
    }

    if (loading || !data) {
        return <Skeleton variant="rounded" height={280} />;
    }

    const { items } = data.getHighPriorityIssues;

    return (
        <Card sx={{ height: '100%' }}>
            <CardContent>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                    <Icon>
                        <img src={ReportsIcon} alt="Reports" width="26px" />
                    </Icon>{' '}
                    <Typography variant="h5">Reports</Typography>
                    <Box flexGrow={1} textAlign="right">
                        <MuiLink
                            component={RouterLink}
                            to="/reports"
                            sx={{
                                textDecoration: 'none',
                                color: 'inherit'
                            }}
                        >
                            <Typography variant="h5" color="warning.dark">
                                View All
                            </Typography>
                        </MuiLink>
                    </Box>
                </Stack>

                {items.length === 0 ? (
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            py: 4,
                            textAlign: 'center'
                        }}
                    >
                        No open issues
                    </Typography>
                ) : (
                    <Stack spacing={1}>
                        {items.map((item) => (
                            <ReportRow key={item.id} item={item} />
                        ))}
                    </Stack>
                )}
            </CardContent>
        </Card>
    );
};

export default ReportsPanel;
