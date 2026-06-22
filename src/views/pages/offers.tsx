import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Drawer from '@mui/material/Drawer';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TablePagination from '@mui/material/TablePagination';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

// assets
import { IconPlus, IconX } from '@tabler/icons-react';

// graphql
import { useMutation, useQuery } from '@apollo/client/react';
import { GET_PROMO_CODES } from 'graphql/queries/promoCode.queries';
import { OccasionResponse } from 'types/occasion.response';
import { GET_OCCASIONS } from 'graphql/queries/occasion.queries';
import { Formik } from 'formik';
import { CREATE_PROMO_CODE } from 'graphql/mutations/offers.mutations';
import useNotification from 'hooks/useNotification';
import { extractApiLevelError, handleErrors } from 'lib/apiError';
import NotificationBanner from 'components/ui-component/snackbar/AppSnackBar';

// ==============================|| TYPES ||============================== //

type PromoStatus = 'ACTIVE' | 'DISABLED' | 'EXPIRED' | 'DRAFT';

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
}

interface PromoCodesResponse {
    promoCodes: {
        data: PromoCode[];
        message: string | null;
        pagination: {
            hasNextPage: boolean;
            hasPreviousPage: boolean;
            limit: number;
            total: number;
            page: number;
        };
    };
}

// ==============================|| HELPERS ||============================== //

const STATUS_COLORS: Record<PromoStatus, { bg: string; text: string }> = {
    DRAFT: { bg: '#FFF8E1', text: '#F9A825' },
    ACTIVE: { bg: '#BFE6C4', text: '#30B010' },
    DISABLED: { bg: '#E0E0E0', text: '#616161' },
    EXPIRED: { bg: '#E0E0E0', text: '#616161' }
};

const formatDiscount = (offer: PromoCode) =>
    offer.discountType === 'PERCENTAGE'
        ? `${offer.percentageAmount}%${offer.maxDiscount ? ` (max Rs ${offer.maxDiscount})` : ''}`
        : `Rs ${offer.flatAmount} off`;

const formatExpiry = (value: string) =>
    new Date(value).toLocaleString('en-US', {
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });

const formatStatus = (status: PromoStatus) => status.charAt(0) + status.slice(1).toLowerCase();

const FILTERS = ['All', 'Active', 'Disabled', 'Expired'];

// ==============================|| STAT CARD ||============================== //

const StatCard = ({ label, value, chip }: { label: string; value: string; chip?: string }) => (
<Card
    sx={{
        p: 2.5,
        borderRadius: '12px',
        boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
    }}
>
    <Stack spacing={1}>
        <Typography variant="body2" color="text.secondary">
            {label}
        </Typography>
        <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="h3" fontWeight={600}>
                {value}
            </Typography>
            {chip && (
                <Chip
                    label={chip}
                    size="small"
                    sx={{ bgcolor: STATUS_COLORS.ACTIVE.bg, color: STATUS_COLORS.ACTIVE.text, fontWeight: 500 }}
                />
            )}
        </Stack>
    </Stack>
</Card>
);

// ==============================|| OFFER ROW ||============================== //

const OfferRow = ({ offer }: { offer: PromoCode }) => {
    const navigate = useNavigate();
    console.log(offer.status,"offerstatus");
    
const colors = STATUS_COLORS[offer.status] ;

    return (
        <Card
            sx={{ px: 2.5, py: 1.75, borderRadius: 0, boxShadow: 'none', borderBottom: '1px solid', borderColor: 'grey.100' }}
        >
            <Grid container alignItems="center">
                <Grid item xs={3}>
                    <Typography variant="subtitle1" fontWeight={500}>
                        {offer.name}
                    </Typography>
                </Grid>
                <Grid item xs={3}>
                    <Typography variant="body2" color="text.secondary">
                        {formatDiscount(offer)}
                    </Typography>
                </Grid>
                <Grid item xs={2}>
                    <Typography variant="body2" color="text.secondary">
                        {formatExpiry(offer.expiryDateTime)}
                    </Typography>
                </Grid>
                <Grid item xs={1}>
                    <Typography variant="body2" color="text.secondary">
                        {offer.totalUsageLimit}
                    </Typography>
                </Grid>
                <Grid item xs={1}>
                    <Typography variant="body2" color="text.secondary">
                        {offer.promoCodeUsedCount}
                    </Typography>
                </Grid>
                <Grid item xs={1}>
                    <Chip
                        label={formatStatus(offer.status)}
                        size="small"
                        sx={{ bgcolor:STATUS_COLORS[offer.status].bg, color: STATUS_COLORS[offer.status].text,fontWeight: 500, borderRadius: '20px' }}
                    />
                </Grid>
                <Grid item xs={1}>
                    <Button size="small" variant="outlined" onClick={() => navigate(`/offers/${offer._id}`)}>
                        View
                    </Button>
                </Grid>
            </Grid>
        </Card>
    );
};

// ==============================|| OFFER LIST ||============================== //

const OfferList = ({ onCreateClick, showCreateButton }: { onCreateClick: () => void; showCreateButton: boolean }) => {
    const [filter, setFilter] = useState('All');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const { data, loading } = useQuery<PromoCodesResponse>(GET_PROMO_CODES, {
        variables: {
            paginationInput: {
                page,
                limit: rowsPerPage
            }
        }
    });

    const offers = data?.promoCodes?.data || [];
    const total = data?.promoCodes?.pagination?.total || 0;

    const filteredOffers =
        filter === 'All' ? offers : offers.filter((o) => formatStatus(o.status) === filter);

    return (
        <Card sx={{ boxShadow: 'none', border: '1px solid', borderColor: 'grey.100' }}>
            <Box sx={{ p: 2.5, pb: 2 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                    <Stack spacing={0.25}>
                        <Typography variant="h4" fontWeight={600}>
                            Offer List
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Create &amp; manage promo codes
                        </Typography>
                    </Stack>

                    {showCreateButton && (
                        <IconButton
                            onClick={onCreateClick}
                            sx={{ bgcolor: 'primary.main', color: '#fff', '&:hover': { bgcolor: 'primary.dark' } }}
                        >
                            <IconPlus size={20} />
                        </IconButton>
                    )}
                </Stack>

                <Stack direction="row" spacing={1} sx={{ mt: 2, overflowX: 'auto', pb: 0.5 }}>
                    {FILTERS.map((f) => (
                        <Button
                            key={f}
                            size="small"
                            onClick={() => setFilter(f)}
                            variant={filter === f ? 'contained' : 'outlined'}
                            sx={{
                                flexShrink: 0,
                                bgcolor: filter === f ? '#1A1A1A' : 'transparent',
                                color: filter === f ? '#fff' : 'text.secondary',
                                borderColor: 'grey.200',
                                '&:hover': { bgcolor: filter === f ? '#1A1A1A' : 'grey.50' }
                            }}
                        >
                            {f}
                        </Button>
                    ))}
                </Stack>
            </Box>

            <Box sx={{ overflowX: 'auto' }}>
                <Box sx={{ minWidth: 700 }}>
                    <Box sx={{ bgcolor: '#EDEDED', px: 2.5, py: 1.25 }}>
                        <Grid container alignItems="center">
                            <Grid item xs={3}>
                                <Typography variant="subtitle2" color="text.secondary">Code</Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <Typography variant="subtitle2" color="text.secondary">Discount</Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <Typography variant="subtitle2" color="text.secondary">Expiry</Typography>
                            </Grid>
                            <Grid item xs={1}>
                                <Typography variant="subtitle2" color="text.secondary">Limit</Typography>
                            </Grid>
                            <Grid item xs={1}>
                                <Typography variant="subtitle2" color="text.secondary">Used</Typography>
                            </Grid>
                            <Grid item xs={1}>
                                <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                            </Grid>
                            <Grid item xs={1}>
                                <Typography variant="subtitle2" color="text.secondary">Action</Typography>
                            </Grid>
                        </Grid>
                    </Box>

                    {loading ? (
                        <Typography variant="body2" color="text.secondary" sx={{ p: 2.5 }}>
                            Loading...
                        </Typography>
                    ) : filteredOffers.length === 0 ? (
                        <Typography variant="body2" color="text.secondary" sx={{ p: 2.5 }}>
                            No offers found.
                        </Typography>
                    ) : (
                        filteredOffers.map((offer) => <OfferRow key={offer._id} offer={offer} />)
                    )}
                </Box>
            </Box>

            <TablePagination
                component="div"
                count={total}
                page={page}
                onPageChange={(_, newPage) => setPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(e) => {
                    setRowsPerPage(parseInt(e.target.value, 10));
                    setPage(0);
                }}
                rowsPerPageOptions={[10, 25, 50]}
            />
        </Card>
    );
};

// ==============================|| CREATE OFFER FORM ||============================== //

const CreateOfferForm = ({ onClose }: { onClose: () => void }) => {
    const { data: occasionData, loading: occasionLoading } = useQuery<OccasionResponse>(GET_OCCASIONS, {
        variables: { paginationInput: { page: 0, limit: 50 } }
    });

    const [createPromoCode] = useMutation<CreatePromoCodeResponse, { input: CreatePromoCodeInput }>(CREATE_PROMO_CODE);
    const { notification, showError, showSuccess, clearNotification } = useNotification();

    const occasions = occasionData?.occasion || [];

    if (occasionLoading) return <>Loading...</>;

    return (
        <Formik
            initialValues={{
                name: '',
                discountType: 'PERCENTAGE',
                value: '',
                maxDiscount: '',
                minimumFare: '',
                appliedTo: 'ALL_RIDES',
                totalUsageLimit: '',
                perUserLimit: '',
                startDateTime: '',
                expiryDateTime: '',
                occasionId: ''
            }}
            onSubmit={async (values, { setSubmitting, setStatus }) => {
                try {
                    console.log(values,"values");
                    
                    const isPercentage = values.discountType === 'PERCENTAGE';
                  const response =  await createPromoCode({
                        variables: {
                            input: {
                                  "appliedTo":"ALL_RIDES",
    "discountType":"FLAT",
    "expiryDateTime": "2026-08-08",
    "flatAmount": 3,
    "maxDiscount": 30,
    "minimumFare": 300,
    "name": "rainyi",
    "occasionId": "6a295a2b88971b824a7dafa4",
    "perUserLimit": 3,
    "percentageAmount": 3,
    "startDateTime": "2026-08-08",
    "totalUsageLimit": 3
                                // name: values.name,
                                // discountType: values.discountType as 'PERCENTAGE' | 'FLAT',
                                // ...(isPercentage
                                //     ? { percentageAmount: Number(values.value) }
                                //     : { flatAmount: Number(values.value) }
                                // ),
                                // maxDiscount: values.maxDiscount ? Number(values.maxDiscount) : undefined,
                                // minimumFare: Number(values.minimumFare),
                                // appliedTo: values.appliedTo as 'ALL_RIDES' | 'FIRST_RIDE',
                                // totalUsageLimit: Number(values.totalUsageLimit),
                                // perUserLimit: Number(values.perUserLimit),
                                // startDateTime: values.startDateTime,
                                // expiryDateTime: values.expiryDateTime,
                                // occasionId: values.occasionId
                            }
                        }
                    });
                    console.log(response,"resp");
                    
                    setStatus({ success: true });
                    showSuccess('Promo code created successfully');
                    onClose();
                } catch (err: any) {
                    console.log(err,"err");
                    
                    setStatus({ success: false });
                    // handleErrors(err, )
                    showError(extractApiLevelError(err));
                } finally {
                    setSubmitting(false);
                }
            }}
        >
            {({ handleSubmit, values, handleChange, isSubmitting }) => (
                <>
                    <NotificationBanner
                        open={Boolean(notification.message)}
                        message={notification.message}
                        onClose={clearNotification}
                        severity={notification.severity}
                    />

                    <form onSubmit={handleSubmit}>
                        <Card sx={{ boxShadow: 'none', border: '1px solid', borderColor: 'grey.100', height: '100%' }}>
                            <Box sx={{ p: 2.5 }}>
                                <Stack direction="row" alignItems="center" justifyContent="space-between">
                                    <Stack spacing={0.25}>
                                        <Typography variant="h4" fontWeight={600}>Create Offer</Typography>
                                        <Typography variant="body2" color="text.secondary">Promo code for mobile app</Typography>
                                    </Stack>
                                    <IconButton onClick={onClose} sx={{ display: { xs: 'inline-flex', lg: 'none' } }}>
                                        <IconX size={20} />
                                    </IconButton>
                                </Stack>
                            </Box>

                            <Box sx={{ px: 2.5, pb: 2.5 }}>
                                <Stack spacing={2.5}>
                                    <Grid container spacing={2}>

                                        <Grid item xs={12} sm={6}>
                                            <Stack spacing={1}>
                                                <Typography variant="body2" fontWeight={500}>Promo Code</Typography>
                                                <TextField
                                                    fullWidth size="small"
                                                    name="name"
                                                    placeholder="WELCOME10"
                                                    value={values.name}
                                                    onChange={handleChange}
                                                />
                                            </Stack>
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Stack spacing={1}>
                                                <Typography variant="body2" fontWeight={500}>Occasion</Typography>
                                                <TextField
                                                    select fullWidth size="small"
                                                    name="occasionId"
                                                    value={values.occasionId}
                                                    onChange={handleChange}
                                                    disabled={occasionLoading}
                                                    SelectProps={{ displayEmpty: true }}
                                                >
                                                    <MenuItem value=""><em>Choose occasion</em></MenuItem>
                                                    {occasions.map((o) => (
                                                        <MenuItem key={o._id} value={o._id}>{o.occasionName}</MenuItem>
                                                    ))}
                                                </TextField>
                                            </Stack>
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Stack spacing={1}>
                                                <Typography variant="body2" fontWeight={500}>Discount Type</Typography>
                                                <TextField
                                                    select fullWidth size="small"
                                                    name="discountType"
                                                    value={values.discountType}
                                                    onChange={handleChange}
                                                >
                                                    <MenuItem value="PERCENTAGE">Percentage</MenuItem>
                                                    <MenuItem value="FLAT">Flat</MenuItem>
                                                </TextField>
                                            </Stack>
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Stack spacing={1}>
                                                <Typography variant="body2" fontWeight={500}>Value</Typography>
                                                <TextField
                                                    fullWidth size="small"
                                                    name="value"
                                                    placeholder={values.discountType === 'PERCENTAGE' ? '10%' : 'Rs 100'}
                                                    value={values.value}
                                                    onChange={handleChange}
                                                />
                                            </Stack>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Stack spacing={1}>
                                                <Typography variant="body2" fontWeight={500}>Max Discount (optional)</Typography>
                                                <TextField
                                                    fullWidth size="small"
                                                    name="maxDiscount"
                                                    placeholder="e.g. Rs 100"
                                                    value={values.maxDiscount}
                                                    onChange={handleChange}
                                                />
                                            </Stack>
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Stack spacing={1}>
                                                <Typography variant="body2" fontWeight={500}>Minimum Fare</Typography>
                                                <TextField
                                                    fullWidth size="small"
                                                    name="minimumFare"
                                                    placeholder="Rs 200"
                                                    value={values.minimumFare}
                                                    onChange={handleChange}
                                                />
                                            </Stack>
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Stack spacing={1}>
                                                <Typography variant="body2" fontWeight={500}>Applies To</Typography>
                                                <TextField
                                                    select fullWidth size="small"
                                                    name="appliedTo"
                                                    value={values.appliedTo}
                                                    onChange={handleChange}
                                                >
                                                    <MenuItem value="ALL_RIDES">All rides</MenuItem>
                                                    <MenuItem value="FIRST_RIDE">First ride</MenuItem>
                                                </TextField>
                                            </Stack>
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Stack spacing={1}>
                                                <Typography variant="body2" fontWeight={500}>Total Usage Limit</Typography>
                                                <TextField
                                                    fullWidth size="small"
                                                    name="totalUsageLimit"
                                                    placeholder="500"
                                                    value={values.totalUsageLimit}
                                                    onChange={handleChange}
                                                />
                                            </Stack>
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Stack spacing={1}>
                                                <Typography variant="body2" fontWeight={500}>Per User Limit</Typography>
                                                <TextField
                                                    fullWidth size="small"
                                                    name="perUserLimit"
                                                    placeholder="1"
                                                    value={values.perUserLimit}
                                                    onChange={handleChange}
                                                />
                                            </Stack>
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Stack spacing={1}>
                                                <Typography variant="body2" fontWeight={500}>Start Date & Time</Typography>
                                                <TextField
                                                    fullWidth size="small"
                                                    type="datetime-local"
                                                    name="startDateTime"
                                                    value={values.startDateTime}
                                                    onChange={handleChange}
                                                />
                                            </Stack>
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Stack spacing={1}>
                                                <Typography variant="body2" fontWeight={500}>Expiry Date & Time</Typography>
                                                <TextField
                                                    fullWidth size="small"
                                                    type="datetime-local"
                                                    name="expiryDateTime"
                                                    value={values.expiryDateTime}
                                                    onChange={handleChange}
                                                />
                                            </Stack>
                                        </Grid>

                                    </Grid>

                                    <Box sx={{ bgcolor: 'grey.50', borderRadius: 1, p: 1.5 }}>
                                        <Typography variant="caption" color="text.secondary">
                                            <strong>Info:</strong> "Total Used" will increase each time code is redeemed in mobile app.
                                        </Typography>
                                    </Box>

                                    <Stack direction="row" spacing={1.5}>
                                        <Button fullWidth variant="outlined" color="inherit" onClick={onClose}>
                                            Cancel
                                        </Button>
                                        <Button fullWidth variant="contained" color="success" type="submit" disabled={isSubmitting}>
                                            Create Offer
                                        </Button>
                                    </Stack>
                                </Stack>
                            </Box>
                        </Card>
                    </form>
                </>
            )}
        </Formik>
    );
};
// ==============================|| OFFERS PAGE ||============================== //

const Offers = () => {
    const theme = useTheme();
    const downLG = useMediaQuery(theme.breakpoints.down('lg'));
    const [createOpen, setCreateOpen] = useState(false);

    return (
        <Stack spacing={2.5}>

            {/* Stat cards */}
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard label="Active Offers" value="8" chip="Live" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard label="Scheduled" value="3" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard label="Total Used (All)" value="1,284" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard label="Discount Given (est.)" value="Rs. 42,560" />
                </Grid>
            </Grid>

            {/* List + Create form */}
            <Grid container spacing={2.5}>
                <Grid item xs={12} lg={8}>
                    <OfferList onCreateClick={() => setCreateOpen(true)} showCreateButton={downLG} />
                </Grid>

                {!downLG && (
                    <Grid item xs={12} lg={4}>
                        <CreateOfferForm onClose={() => setCreateOpen(false)} />
                    </Grid>
                )}
            </Grid>

            {/* Mobile/tablet create drawer */}
            <Drawer
                anchor="right"
                open={downLG && createOpen}
                onClose={() => setCreateOpen(false)}
                sx={{ '& .MuiDrawer-paper': { width: { xs: '100%', sm: 420 } } }}
            >
                <Box sx={{ overflowY: 'auto', height: '100%' }}>
                    <CreateOfferForm onClose={() => setCreateOpen(false)} />
                </Box>
            </Drawer>

        </Stack>
    );
};

export default Offers;