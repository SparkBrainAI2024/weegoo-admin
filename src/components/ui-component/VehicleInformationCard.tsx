import React from 'react';
import { Box, Paper, Typography, Stack, Grid } from '@mui/material';
import DirectionsCarFilledOutlinedIcon from '@mui/icons-material/DirectionsCarFilledOutlined';

// ---------------------------------------------------------------------------
// STATIC MOCK DATA — a mix of short values ("Car", "Blue") and longer ones
// ("BA 2 PA 4567") on purpose, so the two-column field grid gets tested
// against real width variance before it's wired to the real vehicle query.
// ---------------------------------------------------------------------------
const MOCK_VEHICLE = {
    numberPlate: 'BA 2 PA 4567',
    vehicleType: 'Car',
    brand: 'Atto 2',
    model: '2025',
    color: 'Blue',
    engineType: 'EV'
};

function VehicleField({ label, value, icon }: { label: string; value: string; icon?: boolean }) {
    return (
        <Grid item xs={6}>
            <Stack direction="row" gap={1} alignItems="center">
                {/* Icon is optional per-field, not per-row — it's here to mark
                    "this is a vehicle-identity fact" vs. a plain spec value,
                    matching how the reference layout alternates them. */}
                {icon && <DirectionsCarFilledOutlinedIcon fontSize="small" color="success" />}
                <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                        {label}
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                        {value}
                    </Typography>
                </Box>
            </Stack>
        </Grid>
    );
}

export function VehicleInformationCard({ minHeight }: { minHeight: number }) {
    return (
        <Paper sx={{ p: 3, minHeight }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
                Vehicle Information
            </Typography>
            <Grid container spacing={2}>
                <VehicleField icon label="Vehicle Number" value={MOCK_VEHICLE.numberPlate} />
                <VehicleField label="Color" value={MOCK_VEHICLE.color} />
                <VehicleField icon label="Vehicle Type" value={MOCK_VEHICLE.vehicleType} />
                <VehicleField label="Engine Type" value={MOCK_VEHICLE.engineType} />
                <VehicleField icon label="Brand" value={MOCK_VEHICLE.brand} />
                <VehicleField label="Model" value={MOCK_VEHICLE.model} />
            </Grid>
        </Paper>
    );
}

export default VehicleInformationCard;
