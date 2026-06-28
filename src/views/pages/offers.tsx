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
import Stack from '@mui/material/Stack';
import TablePagination from '@mui/material/TablePagination';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

// assets
import { IconEdit, IconEye, IconPlus } from '@tabler/icons-react';

// graphql
import { GET_PROMO_CODES } from 'graphql/queries/promoCode.queries';
import { PromoStatus } from 'constants/enum';
import { useQuery } from '@apollo/client/react';
import CreateOfferForm from './forms/create-offer-form';
import { PromoCode, PromoCodesResponse, STATUS_COLORS } from 'types/offers.type';

// ==============================|| TYPES ||============================== //

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

// ==============================|| STAT CARD ||============================== //

const StatCard = ({ label, value, chip }: { label: string; value: string; chip?: string }) => (
    <Card
        sx={{
            p: 2.5,
            borderRadius: '12px',
            boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)'
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

const OfferRow = ({ offer, onEditClick }: { offer: PromoCode; onEditClick: (offer: PromoCode) => void }) => {
    const navigate = useNavigate();
    // in Offers component

    return (
        <Card sx={{ px: 2.5, py: 1.75, borderRadius: 0, boxShadow: 'none', borderBottom: '1px solid', borderColor: 'grey.100' }}>
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
                        sx={{
                            bgcolor: STATUS_COLORS[offer.status].bg,
                            color: STATUS_COLORS[offer.status].text,
                            fontWeight: 500,
                            borderRadius: '20px'
                        }}
                    />
                </Grid>
                <Grid item xs={1}>
                    <Stack direction="row" spacing={0.5}>
                        <IconButton size="small" onClick={() => navigate(`/offers/${offer._id}`)}>
                            <IconEye size={16} />
                        </IconButton>
                        <IconButton size="small" color="warning" onClick={() => onEditClick(offer)}>
                            <IconEdit size={16} />
                        </IconButton>
                    </Stack>
                </Grid>
            </Grid>
        </Card>
    );
};

const FILTERS = ['All', 'DRAFT', 'ACTIVE', 'INACTIVE', 'EXPIRED'] as const;
type Filter = (typeof FILTERS)[number];
const FILTER_LABELS: Record<Filter, string> = {
    All: 'All',
    DRAFT: 'Draft',
    ACTIVE: 'Active',
    INACTIVE: 'Inactive',
    EXPIRED: 'Expired'
};

// ==============================|| OFFER LIST ||============================== //

const OfferList = ({
    onCreateClick,
    onEditClick,
    showCreateButton
}: {
    onCreateClick: () => void;
    onEditClick: (offer: PromoCode) => void; // ← add this
    showCreateButton: boolean;
}) => {
    const [filter, setFilter] = useState(FILTER_LABELS.All);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const { data, loading } = useQuery<PromoCodesResponse>(GET_PROMO_CODES, {
        variables: {
            paginationInput: {
                page,
                limit: rowsPerPage,
                ...(filter !== FILTERS[0] && { filter: { status: filter } })
            }
        }
    });

    const handleFilterChange = (newFilter: Filter) => {
        setFilter(newFilter);
        setPage(0); // reset to first page on filter change
    };
    const offers = data?.promoCodes?.data || [];
    const total = data?.promoCodes?.pagination?.total || 0;

    return (
        <Card sx={{ boxShadow: 'none', border: '1px solid', borderColor: 'grey.100' }}>
            {/* Header */}
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

                {/* Filter tabs */}
                <Stack direction="row" spacing={1} sx={{ mt: 2, pb: 0.5, width: '80%' }}>
                    {FILTERS.map((f) => (
                        <Button
                            key={f}
                            onClick={() => handleFilterChange(f)}
                            variant={filter === f ? 'contained' : 'outlined'}
                            sx={{
                                flex: 1,

                                flexShrink: 0,
                                bgcolor: filter === f ? '#1A1A1A' : 'transparent',
                                color: filter === f ? '#fff' : 'text.secondary',
                                borderColor: 'grey.200',
                                borderRadius: 4,
                                '&:hover': { bgcolor: filter === f ? '#1A1A1A' : 'grey.50' }
                            }}
                        >
                            {FILTER_LABELS[f]}
                        </Button>
                    ))}
                </Stack>
            </Box>

            {/* Table */}
            <Box sx={{ overflowX: 'auto' }}>
                <Box sx={{ minWidth: 700 }}>
                    {/* Table header */}
                    <Box sx={{ bgcolor: '#EDEDED', px: 2.5, py: 1.25 }}>
                        <Grid container alignItems="center">
                            <Grid item xs={3}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Code
                                </Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Discount
                                </Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Expiry
                                </Typography>
                            </Grid>
                            <Grid item xs={1}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Limit
                                </Typography>
                            </Grid>
                            <Grid item xs={1}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Used
                                </Typography>
                            </Grid>
                            <Grid item xs={1}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Status
                                </Typography>
                            </Grid>
                            <Grid item xs={1}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Action
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Table rows */}
                    {loading ? (
                        <Typography variant="body2" color="text.secondary" sx={{ p: 2.5 }}>
                            Loading...
                        </Typography>
                    ) : offers.length === 0 ? (
                        <Typography variant="body2" color="text.secondary" sx={{ p: 2.5 }}>
                            No offers found.
                        </Typography>
                    ) : (
                        offers.map((offer) => <OfferRow key={offer._id} offer={offer} onEditClick={onEditClick} />)
                    )}
                </Box>
            </Box>

            {/* Pagination */}
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

// ==============================|| OFFERS PAGE ||============================== //

const Offers = () => {
    const theme = useTheme();
    const downLG = useMediaQuery(theme.breakpoints.down('lg'));
    const [createOpen, setCreateOpen] = useState(false);
    const [selectedOffer, setSelectedOffer] = useState<PromoCode | null>(null);

    const handleEditClick = (offer: PromoCode) => {
        setSelectedOffer(offer);
        setCreateOpen(true);
    };

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
                    <OfferList
                        onCreateClick={() => {
                            setSelectedOffer(null);
                            setCreateOpen(true);
                        }}
                        onEditClick={handleEditClick}
                        showCreateButton={downLG}
                    />
                </Grid>

                {!downLG && (
                    <Grid item xs={12} lg={4}>
                        <CreateOfferForm
                            key={selectedOffer?._id || 'create'} // ← this is the fix
                            initialData={selectedOffer}
                            onClose={() => {
                                setCreateOpen(false);
                                setSelectedOffer(null);
                            }}
                        />
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
                    <CreateOfferForm
                        key={selectedOffer?._id || 'create'} // ← this is the fix
                        initialData={selectedOffer}
                        onClose={() => setCreateOpen(false)}
                    />
                </Box>
            </Drawer>
        </Stack>
    );
};

export default Offers;
