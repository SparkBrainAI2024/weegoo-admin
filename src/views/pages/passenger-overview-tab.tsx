import { Avatar, Box, Card, Chip, Grid, Stack, Typography } from '@mui/material';
import { RiderOverview } from 'types/rider.types';

interface Props {
    rider: RiderOverview;
}

const InfoRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <Box>
        <Typography variant="caption" color="text.secondary">
            {label}
        </Typography>
        <Typography variant="body1">{value}</Typography>
    </Box>
);

const RiderOverviewTab = ({ rider }: Props) => (
    <Card sx={{ p: 3 }}>
        <Typography variant="subtitle1" fontWeight={600}>
            Basic Information
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
            Rider profile details
        </Typography>

        <Stack direction="row" spacing={2} alignItems="center" mb={3}>
            <Avatar src={rider.profileImage} sx={{ width: 56, height: 56 }}>
                {rider.fullName?.[0]}
            </Avatar>
            <Box>
                <Typography variant="subtitle1">{rider.fullName}</Typography>
                <Typography variant="caption" color="text.secondary">
                    ID · {rider.id.slice(-5)}
                </Typography>
            </Box>
        </Stack>

        <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
                <InfoRow label="Phone" value={rider.phone || '—'} />
            </Grid>
            <Grid item xs={12} md={4}>
                <InfoRow
                    label="Account Status"
                    value={
                        <Chip
                            label={rider.suspended ? 'Blocked' : 'Active'}
                            size="small"
                            color={rider.suspended ? 'error' : 'success'}
                            variant="outlined"
                        />
                    }
                />
            </Grid>
            <Grid item xs={12} md={4}>
                <InfoRow label="Email" value={rider.email || '—'} />
            </Grid>
            <Grid item xs={12} md={4}>
                <InfoRow
                    label="Phone Verified"
                    value={
                        <Chip
                            label={rider.phoneVerified ? 'Yes' : 'No'}
                            size="small"
                            color={rider.phoneVerified ? 'success' : 'default'}
                            variant="outlined"
                        />
                    }
                />
            </Grid>
            <Grid item xs={12} md={4}>
                <InfoRow label="Joined Date" value={rider.joinedDate || '—'} />
            </Grid>
            <Grid item xs={12} md={4}>
                <InfoRow label="Last Active" value={rider.lastActive || '—'} />
            </Grid>
        </Grid>
    </Card>
);

export default RiderOverviewTab;
