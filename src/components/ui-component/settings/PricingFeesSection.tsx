import { useEffect, useState } from 'react';
import { Grid, TextField, Typography, Box, Button, Paper, Skeleton, MenuItem, InputAdornment } from '@mui/material';
import { usePricingFees } from 'hooks/usePricingFees';
import { VehiclePricing } from 'graphql/queries/settings.queries';

export default function PricingFeesSection() {
    const { configs, loading, saving, save } = usePricingFees();
    const [selectedType, setSelectedType] = useState<VehiclePricing['vehicleType']>('car');
    const [form, setForm] = useState<VehiclePricing | null>(null);

    useEffect(() => {
        if (configs.length) {
            const current = configs.find((c) => c.vehicleType === selectedType) ?? configs[0];
            setForm(current);
            setSelectedType(current.vehicleType);
        }
    }, [configs, selectedType]);

    const handleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const type = e.target.value as VehiclePricing['vehicleType'];
        setSelectedType(type);
        const match = configs.find((c) => c.vehicleType === type);
        if (match) setForm(match);
    };

    const handleFieldChange = (field: keyof VehiclePricing) => (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!form) return;
        setForm({ ...form, [field]: Number(e.target.value) });
    };

    const handleCancel = () => {
        const original = configs.find((c) => c.vehicleType === selectedType);
        if (original) setForm(original);
    };

    const handleSave = () => {
        if (form) save(form);
    };

    if (loading || !form) {
        return (
            <Box>
                <Skeleton height={40} width={220} />
                <Skeleton height={56} sx={{ mt: 2 }} />
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h5" fontWeight={600}>
                Pricing & Fees
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Configure platform commission and basic charges
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={2.4}>
                    <TextField select label="Vehicle type" fullWidth value={selectedType} onChange={handleTypeChange}>
                        <MenuItem value="car">Car</MenuItem>
                        <MenuItem value="bike">Bike</MenuItem>
                        <MenuItem value="auto">Auto</MenuItem>
                    </TextField>
                </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
                    <TextField
                        label="Commission (%)"
                        fullWidth
                        type="number"
                        value={form.commission}
                        onChange={handleFieldChange('commission')}
                        InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
                    <TextField
                        label="Base Fare"
                        fullWidth
                        type="number"
                        value={form.baseFare}
                        onChange={handleFieldChange('baseFare')}
                        InputProps={{ startAdornment: <InputAdornment position="start">Rs</InputAdornment> }}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
                    <TextField
                        label="Amount Per Km"
                        fullWidth
                        type="number"
                        value={form.amountPerKm}
                        onChange={handleFieldChange('amountPerKm')}
                        InputProps={{ startAdornment: <InputAdornment position="start">Rs</InputAdornment> }}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
                    <TextField
                        label="Amount Per Min"
                        fullWidth
                        type="number"
                        value={form.amountPerMin}
                        onChange={handleFieldChange('amountPerMin')}
                        InputProps={{ startAdornment: <InputAdornment position="start">Rs</InputAdornment> }}
                    />
                </Grid>
            </Grid>

            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
                Note: Commission applies to both Wallet and Cash rides.
            </Typography>

            <Paper
                elevation={0}
                sx={{
                    mt: 4,
                    p: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2
                }}
            >
                <Typography variant="body2" color="text.secondary">
                    Save changes to apply Pricing settings for {selectedType}.
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button variant="outlined" color="inherit" onClick={handleCancel} disabled={saving}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="warning" onClick={handleSave} disabled={saving}>
                        {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
}
