import { useNavigate, useParams } from 'react-router-dom';

// material-ui
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// graphql
import { useMutation, useQuery } from '@apollo/client/react';
import { GET_PROMO_CODE, GET_PROMO_CODES } from 'graphql/queries/promoCode.queries';
import { ACTIVATE_PROMO_CODE, DEACTIVATE_PROMO_CODE, REMOVE_PROMO_CODE } from 'graphql/mutations/offers.mutations';
import { OffersMessages } from './forms/offers.messages';
import { extractApiLevelError } from 'lib/apiError';
import useNotification from 'hooks/useNotification';
import { PromoStatus, PromoStatusEnum } from 'constants/enum';
import { ROUTES } from 'constants/routes';
import { STATUS_COLORS } from 'types/offers.type';

// ==============================|| TYPES ||============================== //

interface PromoCode {
    _id: string;
    name: string;
    discountType: 'FLAT' | 'PERCENTAGE';
    percentageAmount: number | null;
    flatAmount: number | null;
    maxDiscount: number | null;
    minimumFare: number;
    appliedTo: string;
    totalUsageLimit: number;
    perUserLimit: number;
    startDateTime: string;
    expiryDateTime: string;
    status: PromoStatus;
    promoCodeUsedCount: number;
    occasion: { occasionName: string } | null;
}

// ==============================|| HELPERS ||============================== //

const formatAppliedTo = (value: string) =>
    value
        .toLowerCase()
        .split('_')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

const formatDateTime = (value: string) =>
    new Date(value).toLocaleString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

// ==============================|| INFO ROW ||============================== //

const InfoItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <Stack spacing={0.5}>
        <Typography variant="caption" color="text.secondary">
            {label}
        </Typography>
        <Typography variant="body1">{value}</Typography>
    </Stack>
);

// ==============================|| SECTION CARD ||============================== //

const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <Card sx={{ p: 3, boxShadow: 'none', border: '1px solid', borderColor: 'grey.100', height: '100%' }}>
        <Stack spacing={2.5}>
            <Typography variant="h5" fontWeight={600}>
                {title}
            </Typography>
            {children}
        </Stack>
    </Card>
);

// ==============================|| OFFER DETAIL PAGE ||============================== //

const OfferDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { showError, showSuccess } = useNotification();

    const { data, loading } = useQuery<{ promoCode: PromoCode }>(GET_PROMO_CODE, {
        variables: { promoCodeId: id }
    });
    const [activatePromoCode, { loading: activating }] = useMutation(ACTIVATE_PROMO_CODE);

    const [deactivatePromoCode, { loading: deactivating }] = useMutation(DEACTIVATE_PROMO_CODE);
    const [removePromoCode, { loading: deleting }] = useMutation(REMOVE_PROMO_CODE);

    if (loading) {
        return (
            <Typography variant="body2" color="text.secondary">
                Loading...
            </Typography>
        );
    }
    const handleEnable = async () => {
        try {
            await activatePromoCode({
                variables: { activatePromoCodeId: id },
                refetchQueries: [
                    {
                        query: GET_PROMO_CODE,
                        variables: {
                            promoCodeId: id
                        }
                    }
                ]
            });

            showSuccess(OffersMessages.updated_successfully);
        } catch (err: any) {
            showError(extractApiLevelError(err));
        }
    };

    const handleDisable = async () => {
        try {
            await deactivatePromoCode({
                variables: { deactivatePromoCodeId: id },
                refetchQueries: [
                    {
                        query: GET_PROMO_CODE,
                        variables: {
                            promoCodeId: id
                        }
                    }
                ]
            });

            showSuccess(OffersMessages.updated_successfully);
        } catch (err: any) {
            showError(extractApiLevelError(err));
        }
    };

    const handleDelete = async () => {
        try {
            await removePromoCode({
                variables: { removePromoCodeId: id },
                refetchQueries: [
                    {
                        query: GET_PROMO_CODES,
                        variables: {
                            paginationInput: {
                                page: 0,
                                limit: 10
                            }
                        }
                    }
                ]
            });

            showSuccess(OffersMessages.deleted_successfully);
            setTimeout(() => {
                navigate(ROUTES.OFFERS);
            }, 500);
        } catch (err: any) {
            showError(extractApiLevelError(err));
        }
    };
    const offer = data?.promoCode;

    if (!offer) {
        return (
            <Typography variant="body2" color="text.secondary">
                Offer not found.
            </Typography>
        );
    }

    const colors = STATUS_COLORS[offer.status];
    const usagePercent = offer.totalUsageLimit > 0 ? (offer.promoCodeUsedCount / offer.totalUsageLimit) * 100 : 0;

    const discountValue = offer.discountType === 'PERCENTAGE' ? `${offer.percentageAmount}%` : `Rs ${offer.flatAmount}`;

    return (
        <Stack spacing={2.5}>
            {/* Breadcrumb row */}
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                justifyContent="space-between"
                spacing={2}
            >
                <Stack direction="row" alignItems="center" spacing={1.5} flexWrap="wrap">
                    <Button size="small" variant="outlined" color="inherit" onClick={() => navigate('/offers')}>
                        ← Back
                    </Button>
                    <Typography variant="body1" color="text.secondary">
                        Offers /
                    </Typography>
                    <Typography variant="subtitle1" fontWeight={600}>
                        {offer.name}
                    </Typography>
                    <Chip
                        label={offer.status.charAt(0) + offer.status.slice(1).toLowerCase()}
                        size="small"
                        sx={{ bgcolor: colors.bg, color: colors.text, fontWeight: 500, borderRadius: '20px' }}
                    />
                </Stack>

                <Stack direction="row" spacing={1.5}>
                    {/* Only ACTIVE can be disabled */}
                    {offer.status === PromoStatusEnum.ACTIVE && (
                        <Button variant="contained" color="error" onClick={handleDisable} disabled={deactivating}>
                            {deactivating ? 'Disabling...' : 'Disable'}
                        </Button>
                    )}

                    {/* DRAFT and INACTIVE can be enabled */}
                    {(offer.status === PromoStatusEnum.DRAFT || offer.status === PromoStatusEnum.INACTIVE) && (
                        <Button variant="contained" color="success" onClick={handleEnable} disabled={activating}>
                            {activating ? 'Enabling...' : 'Enable'}
                        </Button>
                    )}

                    {/* Only DRAFT can be deleted */}
                    {offer.status === PromoStatusEnum.DRAFT && (
                        <Button variant="outlined" color="error" onClick={handleDelete} disabled={deleting}>
                            {deleting ? 'Deleting...' : 'Delete Offer'}
                        </Button>
                    )}
                </Stack>
            </Stack>

            {/* Hero card */}
            <Card sx={{ p: 3, boxShadow: 'none', border: '1px solid', borderColor: 'grey.100' }}>
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                    justifyContent="space-between"
                    spacing={2}
                >
                    <Stack spacing={0.5}>
                        <Typography variant="caption" color="text.secondary">
                            Promo Code
                        </Typography>
                        <Typography variant="h2" fontWeight={700}>
                            {offer.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Used in mobile app during ride booking (discount applies if valid &amp; within limits)
                        </Typography>
                    </Stack>
                </Stack>
            </Card>

            {/* 2x2 detail grid */}
            <Grid container spacing={2.5}>
                <Grid item xs={12} md={6}>
                    <SectionCard title="Discount Rules">
                        <Grid container spacing={2.5}>
                            <Grid item xs={6}>
                                <InfoItem label="Type" value={formatAppliedTo(offer.discountType)} />
                            </Grid>
                            <Grid item xs={6}>
                                <InfoItem label="Value" value={discountValue} />
                            </Grid>
                            <Grid item xs={6}>
                                <InfoItem label="Max Discount" value={offer.maxDiscount ? `Rs ${offer.maxDiscount}` : '—'} />
                            </Grid>
                            <Grid item xs={6}>
                                <InfoItem label="Minimum Fare" value={`Rs ${offer.minimumFare}`} />
                            </Grid>
                            <Grid item xs={12}>
                                <InfoItem label="Applies To" value={formatAppliedTo(offer.appliedTo)} />
                            </Grid>
                        </Grid>
                    </SectionCard>
                </Grid>

                <Grid item xs={12} md={6}>
                    <SectionCard title="Validity">
                        <Grid container spacing={2.5}>
                            <Grid item xs={12}>
                                <InfoItem label="Start Date & Time" value={formatDateTime(offer.startDateTime)} />
                            </Grid>
                            <Grid item xs={12}>
                                <InfoItem label="Expiry Date & Time" value={formatDateTime(offer.expiryDateTime)} />
                            </Grid>
                            <Grid item xs={12}>
                                <InfoItem label="Expiry Behavior" value="Code becomes invalid after expiry" />
                            </Grid>
                        </Grid>
                    </SectionCard>
                </Grid>

                <Grid item xs={12} md={6}>
                    <SectionCard title="Usage">
                        <Grid container spacing={2.5}>
                            <Grid item xs={6}>
                                <InfoItem label="Total Usage Limit" value={offer.totalUsageLimit} />
                            </Grid>
                            <Grid item xs={6}>
                                <InfoItem label="Per User Limit" value={offer.perUserLimit} />
                            </Grid>
                            <Grid item xs={12}>
                                <Stack spacing={1}>
                                    <Stack direction="row" alignItems="baseline" justifyContent="space-between">
                                        <Stack direction="row" alignItems="baseline" spacing={0.5}>
                                            <Typography variant="caption" color="text.secondary">
                                                Total Used
                                            </Typography>
                                        </Stack>
                                        <Typography variant="caption" color="text.secondary">
                                            {usagePercent.toFixed(1)}%
                                        </Typography>
                                    </Stack>
                                    <Stack direction="row" alignItems="baseline" spacing={0.5}>
                                        <Typography variant="h4" fontWeight={700}>
                                            {offer.promoCodeUsedCount}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            / {offer.totalUsageLimit}
                                        </Typography>
                                    </Stack>
                                    <LinearProgress
                                        variant="determinate"
                                        value={Math.min(usagePercent, 100)}
                                        sx={{
                                            height: 8,
                                            borderRadius: 4,
                                            bgcolor: 'grey.100',
                                            '& .MuiLinearProgress-bar': { borderRadius: 4, bgcolor: 'success.main' }
                                        }}
                                    />
                                </Stack>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="caption" color="text.secondary">
                                    Note: "Total Used" increases each time the code is redeemed in the mobile app.
                                </Typography>
                            </Grid>
                        </Grid>
                    </SectionCard>
                </Grid>

                <Grid item xs={12} md={6}>
                    <SectionCard title="Restrictions">
                        <Grid container spacing={2.5}>
                            <Grid item xs={12}>
                                <InfoItem label="Eligible Users" value="All riders" />
                            </Grid>
                            <Grid item xs={12}>
                                <InfoItem label="Payment Method" value="Wallet + Cash" />
                            </Grid>
                            <Grid item xs={12}>
                                <InfoItem label="Code Stacking" value="Not allowed" />
                            </Grid>
                        </Grid>
                    </SectionCard>
                </Grid>
            </Grid>

            <Typography variant="caption" color="text.secondary">
                Tip: Disable offer if code leaks publicly. Expired/limit-reached codes won't apply in mobile app.
            </Typography>
        </Stack>
    );
};

export default OfferDetail;
