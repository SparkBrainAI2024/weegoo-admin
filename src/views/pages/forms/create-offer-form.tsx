import { useMutation, useQuery } from '@apollo/client/react';
import { Box, Button, MenuItem, TextField } from '@mui/material';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { IconX } from '@tabler/icons-react';
import NotificationBanner from 'components/ui-component/snackbar/AppSnackBar';
import { Formik } from 'formik';
import { CREATE_PROMO_CODE, UPDATE_PROMO_CODE } from 'graphql/mutations/offers.mutations';
import { GET_OCCASIONS } from 'graphql/queries/occasion.queries';
import useNotification from 'hooks/useNotification';
import { extractApiLevelError } from 'lib/apiError';
import { OccasionResponse } from 'types/occasion.response';
import { CreatePromoCodeInput, CreatePromoCodeResponse, PromoCode, UpdatePromoCodeInput, UpdatePromoCodeResponse } from 'types/offers.type';
import { toDateTimeLocal } from 'utils/date';
import { OffersMessages } from './offers.messages';

const CreateOfferForm = ({ onClose, initialData }: { onClose: () => void; initialData?: PromoCode | null }) => {
    const isEdit = Boolean(initialData);
    const { data: occasionData, loading: occasionLoading } = useQuery<OccasionResponse>(GET_OCCASIONS, {
        variables: { paginationInput: { page: 0, limit: 50 } }
    });

    const [createPromoCode] = useMutation<CreatePromoCodeResponse, { input: CreatePromoCodeInput }>(CREATE_PROMO_CODE);
    const { notification, showError, showSuccess, clearNotification } = useNotification();

    const [updatePromoCode] = useMutation<UpdatePromoCodeResponse, { updatePromoCodeId: string; input: UpdatePromoCodeInput }>(
        UPDATE_PROMO_CODE
    );
    const occasions = occasionData?.occasion || [];

    if (occasionLoading) return <>Loading...</>;

    return (
        <Formik
            initialValues={{
                name: initialData?.name || '',
                discountType: initialData?.discountType || 'PERCENTAGE',
                value:
                    initialData?.discountType === 'PERCENTAGE'
                        ? String(initialData?.percentageAmount || '')
                        : String(initialData?.flatAmount || ''),
                maxDiscount: String(initialData?.maxDiscount || ''),
                minimumFare: String(initialData?.minimumFare || ''),
                appliedTo: initialData?.appliedTo || 'ALL_RIDES',
                totalUsageLimit: String(initialData?.totalUsageLimit || ''),
                perUserLimit: String(initialData?.perUserLimit || ''),
                startDateTime: toDateTimeLocal(initialData?.startDateTime || ''),
                expiryDateTime: toDateTimeLocal(initialData?.expiryDateTime || ''),
                occasionId: initialData?.occasion?._id || ''
            }}
            onSubmit={async (values, { setSubmitting, setStatus }) => {
                const isPercentage = values.discountType === 'PERCENTAGE';

                try {
                    if (isEdit) {
                        const response = await updatePromoCode({
                            variables: {
                                updatePromoCodeId: initialData!._id,
                                input: {
                                    name: values.name,
                                    discountType: values.discountType as 'PERCENTAGE' | 'FLAT',
                                    ...(isPercentage ? { percentageAmount: Number(values.value) } : { flatAmount: Number(values.value) }),
                                    maxDiscount: values.maxDiscount ? Number(values.maxDiscount) : undefined,
                                    minimumFare: Number(values.minimumFare),
                                    appliedTo: values.appliedTo as 'ALL_RIDES' | 'FIRST_RIDE',
                                    totalUsageLimit: Number(values.totalUsageLimit),
                                    perUserLimit: Number(values.perUserLimit),
                                    startDateTime: values.startDateTime,
                                    expiryDateTime: values.expiryDateTime,
                                    occasionId: values.occasionId
                                }
                            }
                        });

                        setStatus({ success: true });
                        console.log(response.data, 'datar');

                        showSuccess(response.data?.updatePromoCode.message || OffersMessages.updated_successfully);
                        setTimeout(() => onClose(), 1500);
                    } else {
                        const response = await createPromoCode({
                            variables: {
                                input: {
                                    name: values.name,
                                    discountType: values.discountType as 'PERCENTAGE' | 'FLAT',
                                    ...(isPercentage ? { percentageAmount: Number(values.value) } : { flatAmount: Number(values.value) }),
                                    maxDiscount: values.maxDiscount ? Number(values.maxDiscount) : undefined,
                                    minimumFare: Number(values.minimumFare),
                                    appliedTo: values.appliedTo as 'ALL_RIDES' | 'FIRST_RIDE',
                                    totalUsageLimit: Number(values.totalUsageLimit),
                                    perUserLimit: Number(values.perUserLimit),
                                    startDateTime: values.startDateTime,
                                    expiryDateTime: values.expiryDateTime,
                                    occasionId: values.occasionId
                                }
                            }
                        });

                        setStatus({ success: true });
                        showSuccess('Promo code created successfully');
                        onClose();
                    }
                } catch (err: any) {
                    console.log(err, 'err');

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
                                        <Typography variant="h4" fontWeight={600}>
                                            {isEdit ? 'Edit Offer' : 'Create Offer'}{' '}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Promo code for mobile app
                                        </Typography>
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
                                                <Typography variant="body2" fontWeight={500}>
                                                    Promo Code
                                                </Typography>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    name="name"
                                                    placeholder="WELCOME10"
                                                    value={values.name}
                                                    onChange={handleChange}
                                                />
                                            </Stack>
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Stack spacing={1}>
                                                <Typography variant="body2" fontWeight={500}>
                                                    Occasion
                                                </Typography>
                                                <TextField
                                                    select
                                                    fullWidth
                                                    size="small"
                                                    name="occasionId"
                                                    value={values.occasionId}
                                                    onChange={handleChange}
                                                    disabled={occasionLoading}
                                                    SelectProps={{ displayEmpty: true }}
                                                >
                                                    <MenuItem value="">
                                                        <em>Choose occasion</em>
                                                    </MenuItem>
                                                    {occasions.map((o) => (
                                                        <MenuItem key={o._id} value={o._id}>
                                                            {o.occasionName}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            </Stack>
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Stack spacing={1}>
                                                <Typography variant="body2" fontWeight={500}>
                                                    Discount Type
                                                </Typography>
                                                <TextField
                                                    select
                                                    fullWidth
                                                    size="small"
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
                                                <Typography variant="body2" fontWeight={500}>
                                                    Value
                                                </Typography>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    name="value"
                                                    placeholder={values.discountType === 'PERCENTAGE' ? '10%' : 'Rs 100'}
                                                    value={values.value}
                                                    onChange={handleChange}
                                                />
                                            </Stack>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Stack spacing={1}>
                                                <Typography variant="body2" fontWeight={500}>
                                                    Max Discount (optional)
                                                </Typography>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    name="maxDiscount"
                                                    placeholder="e.g. Rs 100"
                                                    value={values.maxDiscount}
                                                    onChange={handleChange}
                                                />
                                            </Stack>
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Stack spacing={1}>
                                                <Typography variant="body2" fontWeight={500}>
                                                    Minimum Fare
                                                </Typography>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    name="minimumFare"
                                                    placeholder="Rs 200"
                                                    value={values.minimumFare}
                                                    onChange={handleChange}
                                                />
                                            </Stack>
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Stack spacing={1}>
                                                <Typography variant="body2" fontWeight={500}>
                                                    Applies To
                                                </Typography>
                                                <TextField
                                                    select
                                                    fullWidth
                                                    size="small"
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
                                                <Typography variant="body2" fontWeight={500}>
                                                    Total Usage Limit
                                                </Typography>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    name="totalUsageLimit"
                                                    placeholder="500"
                                                    value={values.totalUsageLimit}
                                                    onChange={handleChange}
                                                />
                                            </Stack>
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Stack spacing={1}>
                                                <Typography variant="body2" fontWeight={500}>
                                                    Per User Limit
                                                </Typography>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    name="perUserLimit"
                                                    placeholder="1"
                                                    value={values.perUserLimit}
                                                    onChange={handleChange}
                                                />
                                            </Stack>
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Stack spacing={1}>
                                                <Typography variant="body2" fontWeight={500}>
                                                    Start Date & Time
                                                </Typography>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    type="datetime-local"
                                                    name="startDateTime"
                                                    value={values.startDateTime}
                                                    onChange={handleChange}
                                                />
                                            </Stack>
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Stack spacing={1}>
                                                <Typography variant="body2" fontWeight={500}>
                                                    Expiry Date & Time
                                                </Typography>
                                                <TextField
                                                    fullWidth
                                                    size="small"
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
                                        <Button type="submit" color="success">
                                            {isEdit ? 'Save Changes' : 'Create Offer'}
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

export default CreateOfferForm;
