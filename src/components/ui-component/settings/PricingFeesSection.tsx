import {
    Box,
    Typography,
    Button,
    Paper,
    Skeleton,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Stack
} from '@mui/material';
import { Formik, Form, FieldArray, Field } from 'formik';
import { VehiclePricing } from 'graphql/queries/settings.queries';
import useNotification from 'hooks/useNotification';
import { usePricingFees } from 'hooks/usePricingFess';
import NotificationBanner from '../snackbar/AppSnackBar';
import VehicleTypeIcon from '../VehicleTypeIcon';

const VEHICLE_LABELS: Record<string, string> = {
    BIKE: 'Bike',
    CAR: 'Car',
    MOTORCYCLE: 'Motorcycle',
    VAN: 'Van',
    SUV: 'SUV',
    BUS: 'Bus'
};

export default function PricingFeesSection() {
    const { initialValues, loading, saving, save } = usePricingFees();
    const { showError, showSuccess, notification, clearNotification } = useNotification();

    if (loading || !initialValues) {
        return (
            <Box sx={{ p: 3 }}>
                <Skeleton height={32} width={220} />
                <Skeleton height={20} width={360} sx={{ mt: 1 }} />
                <Skeleton height={300} sx={{ mt: 3 }} />
            </Box>
        );
    }

    return (
        <>
            <NotificationBanner
                open={Boolean(notification?.message)}
                message={notification?.message ?? ''}
                onClose={clearNotification}
                severity={notification?.severity ?? 'success'}
            />
            <Formik
                initialValues={initialValues}
                enableReinitialize
                onSubmit={async (values, { setStatus }) => {
                    try {
                        await save(values);
                        setStatus({ success: true });
                        showSuccess('Pricing updated successfully');
                    } catch {
                        setStatus({ success: false });
                        showError('Pricing updated failed');
                    }
                }}
            >
                {({ values, setFieldValue }) => (
                    <Form>
                        <Box sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
                                <Stack spacing={0.5}>
                                    <Typography variant="h4" fontWeight={600}>
                                        Pricing & Fees
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Configure platform commission and basic charges for different vehicle types.
                                    </Typography>
                                </Stack>
                                <Button type="submit" variant="contained" color="success" disabled={saving}>
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </Box>

                            <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ py: 2 }}>
                                                <Typography variant="overline" color="text.secondary">
                                                    Vehicle Type
                                                </Typography>
                                            </TableCell>
                                            <TableCell sx={{ py: 2 }}>
                                                <Typography variant="overline" color="text.secondary">
                                                    Commission (%)
                                                </Typography>
                                            </TableCell>
                                            <TableCell sx={{ py: 2 }}>
                                                <Typography variant="overline" color="text.secondary">
                                                    Base Fare (Rs)
                                                </Typography>
                                            </TableCell>
                                            <TableCell sx={{ py: 2 }}>
                                                <Typography variant="overline" color="text.secondary">
                                                    Amount Per Km (Rs)
                                                </Typography>
                                            </TableCell>
                                            <TableCell sx={{ py: 2 }}>
                                                <Typography variant="overline" color="text.secondary">
                                                    Amount Per Min (Rs)
                                                </Typography>
                                            </TableCell>
                                            <TableCell sx={{ py: 2 }}>
                                                <Typography variant="overline" color="text.secondary">
                                                    Enabled
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <FieldArray name="pricingList">
                                            {() =>
                                                values.pricingList.map((row: VehiclePricing, index: number) => (
                                                    <TableRow key={row.vehicleType}>
                                                        <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 2 }}>
                                                            <VehicleTypeIcon type={row.vehicleType} />
                                                            <Typography variant="subtitle2" fontWeight={500}>
                                                                {VEHICLE_LABELS[row.vehicleType] ?? row.vehicleType}
                                                            </Typography>
                                                        </TableCell>

                                                        <TableCell sx={{ py: 2 }}>
                                                            <Field
                                                                as={TextField}
                                                                name={`pricingList.${index}.commission`}
                                                                type="number"
                                                                size="small"
                                                                sx={{ width: 100 }}
                                                            />
                                                        </TableCell>

                                                        <TableCell sx={{ py: 2 }}>
                                                            <Field
                                                                as={TextField}
                                                                name={`pricingList.${index}.baseFare`}
                                                                type="number"
                                                                size="small"
                                                                sx={{ width: 100 }}
                                                            />
                                                        </TableCell>

                                                        <TableCell sx={{ py: 2 }}>
                                                            <Field
                                                                as={TextField}
                                                                name={`pricingList.${index}.amountPerKm`}
                                                                type="number"
                                                                size="small"
                                                                sx={{ width: 100 }}
                                                            />
                                                        </TableCell>

                                                        <TableCell sx={{ py: 2 }}>
                                                            <Field
                                                                as={TextField}
                                                                name={`pricingList.${index}.amountPerMinute`}
                                                                type="number"
                                                                size="small"
                                                                sx={{ width: 100 }}
                                                            />
                                                        </TableCell>

                                                        <TableCell sx={{ py: 2 }}>
                                                            <Switch
                                                                checked={row.isEnabled}
                                                                onChange={(e) =>
                                                                    setFieldValue(`pricingList.${index}.isEnabled`, e.target.checked)
                                                                }
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            }
                                        </FieldArray>
                                    </TableBody>
                                </Table>
                            </Paper>

                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.5 }}>
                                Showing 1–{values.pricingList.length} of {values.pricingList.length} vehicle types
                            </Typography>
                        </Box>
                    </Form>
                )}
            </Formik>
        </>
    );
}
