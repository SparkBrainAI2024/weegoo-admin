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
    TextField
} from '@mui/material';
import { Formik, Form, FieldArray, Field } from 'formik';
import { VehiclePricing } from 'graphql/queries/settings.queries';
import useNotification from 'hooks/useNotification';
import { usePricingFees } from 'hooks/usePricingFess';
import NotificationBanner from '../snackbar/AppSnackBar';

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
            <Box>
                <Skeleton height={40} width={220} />
                <Skeleton height={300} sx={{ mt: 2 }} />
            </Box>
        );
    }

    return (
        <>
            {' '}
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
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                            <Box>
                                <Typography variant="h5" fontWeight={600}>
                                    Pricing & Fees
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Configure platform commission and basic charges for different vehicle types.
                                </Typography>
                            </Box>
                            <Button type="submit" variant="contained" color="success" disabled={saving}>
                                {saving ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </Box>

                        <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>VEHICLE TYPE</TableCell>
                                        <TableCell>COMMISSION (%)</TableCell>
                                        <TableCell>BASE FARE (Rs)</TableCell>
                                        <TableCell>AMOUNT PER KM (Rs)</TableCell>
                                        <TableCell>AMOUNT PER MIN (Rs)</TableCell>
                                        <TableCell>ENABLED</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <FieldArray name="pricingList">
                                        {() =>
                                            values.pricingList.map((row: VehiclePricing, index: number) => (
                                                <TableRow key={row.vehicleType}>
                                                    <TableCell>{VEHICLE_LABELS[row.vehicleType] ?? row.vehicleType}</TableCell>

                                                    <TableCell>
                                                        <Field
                                                            as={TextField}
                                                            name={`pricingList.${index}.commission`}
                                                            type="number"
                                                            size="small"
                                                            sx={{ width: 100 }}
                                                        />
                                                    </TableCell>

                                                    <TableCell>
                                                        <Field
                                                            as={TextField}
                                                            name={`pricingList.${index}.baseFare`}
                                                            type="number"
                                                            size="small"
                                                            sx={{ width: 100 }}
                                                        />
                                                    </TableCell>

                                                    <TableCell>
                                                        <Field
                                                            as={TextField}
                                                            name={`pricingList.${index}.amountPerKm`}
                                                            type="number"
                                                            size="small"
                                                            sx={{ width: 100 }}
                                                        />
                                                    </TableCell>

                                                    <TableCell>
                                                        <Field
                                                            as={TextField}
                                                            name={`pricingList.${index}.amountPerMinute`}
                                                            type="number"
                                                            size="small"
                                                            sx={{ width: 100 }}
                                                        />
                                                    </TableCell>

                                                    <TableCell>
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

                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                            Showing 1–{values.pricingList.length} of {values.pricingList.length} vehicle types
                        </Typography>
                    </Form>
                )}
            </Formik>
        </>
    );
}
