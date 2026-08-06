import React from 'react';
import { Box, Paper, Typography, Stack, Grid } from '@mui/material';
import DirectionsCarFilledOutlinedIcon from '@mui/icons-material/DirectionsCarFilledOutlined';
import { Vehicle } from 'graphql/queries/drivers.queries';

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

export function VehicleInformationCard({ height, vehicle }: { height: number; vehicle?: Vehicle }) {
    if (!vehicle) {
        return (
            <Paper sx={{ p: 3, height, overflowY: 'auto' }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Vehicle Information
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    No vehicle information available.
                </Typography>
            </Paper>
        );
    }
    return (
        <Paper sx={{ p: 3, height, overflowY: 'auto' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
                Vehicle Information
            </Typography>
            <Grid container spacing={2}>
                <VehicleField icon label="Vehicle Number" value={vehicle.numberPlate} />
                <VehicleField label="Color" value={vehicle.color} />
                <VehicleField icon label="Vehicle Type" value={vehicle.vehicleType} />
                <VehicleField label="Name" value={vehicle.name} />
                <VehicleField label="Model" value={MOCK_VEHICLE.model} />
            </Grid>
        </Paper>
    );
}

export default VehicleInformationCard;
