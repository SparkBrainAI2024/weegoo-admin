import React, { useEffect } from 'react';
import { useDispatch } from 'store';
import { Link, useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import AnimateButton from 'components/ui-component/extended/AnimateButton';
import useAuth from 'hooks/useAuth';
import useScriptRef from 'hooks/useScriptRef';
import { strengthColor, strengthIndicator } from 'utils/password-strength';
import { openSnackbar } from 'store/slices/snackbar';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { StringColorProps } from 'types';
import { Gender } from 'types/enum';
import { MenuItem, Select } from '@mui/material';

// ===========================|| FIREBASE - REGISTER ||=========================== //

const JWTRegister = ({ ...others }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const scriptedRef = useScriptRef();
    const dispatch = useDispatch();

    const [showPassword, setShowPassword] = React.useState(false);
    const [checked, setChecked] = React.useState(true);

    const [strength, setStrength] = React.useState(0);
    const [level, setLevel] = React.useState<StringColorProps>();

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event: React.SyntheticEvent) => {
        event.preventDefault();
    };

    const changePassword = (value: string) => {
        const temp = strengthIndicator(value);
        setStrength(temp);
        setLevel(strengthColor(temp));
    };

    useEffect(() => {
        changePassword('123456');
    }, []);

    return (
        <>
            <Grid container direction="column" justifyContent="center" spacing={2}>
                <Grid item xs={12} container alignItems="center" justifyContent="center">
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle1">Sign up with Email address</Typography>
                    </Box>
                </Grid>
            </Grid>
<Formik
    initialValues={{
        email: '',
        fullName: '',
        phone: '',
        gender: Gender.MALE,
        submit: null
    }}
    validationSchema={Yup.object().shape({
        email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
        fullName: Yup.string().max(255).required('Full name is required'),
        phone: Yup.string().required('Phone is required'),
        gender: Yup.string().oneOf([Gender.MALE, Gender.FEMALE]).required('Gender is required'),
    })}
    onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
     
    }}
>
    {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
        <form noValidate onSubmit={handleSubmit} {...others}>
            <TextField
                fullWidth
                label="Full Name"
                margin="normal"
                name="fullName"
                type="text"
                value={values.fullName}
                onBlur={handleBlur}
                onChange={handleChange}
                error={Boolean(touched.fullName && errors.fullName)}
                helperText={touched.fullName && errors.fullName}
                sx={{ ...theme.typography.customInput }}
            />

            <FormControl
                fullWidth
                error={Boolean(touched.email && errors.email)}
                sx={{ ...theme.typography.customInput }}
            >
                <InputLabel htmlFor="outlined-adornment-email-register">Email Address</InputLabel>
                <OutlinedInput
                    id="outlined-adornment-email-register"
                    type="email"
                    value={values.email}
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                />
                {touched.email && errors.email && (
                    <FormHelperText error>{errors.email}</FormHelperText>
                )}
            </FormControl>

            <TextField
                fullWidth
                label="Phone Number"
                margin="normal"
                name="phone"
                type="tel"
                value={values.phone}
                onBlur={handleBlur}
                onChange={handleChange}
                error={Boolean(touched.phone && errors.phone)}
                helperText={touched.phone && errors.phone}
                sx={{ ...theme.typography.customInput }}
            />

            <FormControl
                fullWidth
                error={Boolean(touched.gender && errors.gender)}
                sx={{ mt: 2, mb: 1 }}
            >
                <InputLabel>Gender</InputLabel>
                <Select
                    name="gender"
                    value={values.gender}
                    label="Gender"
                    onBlur={handleBlur}
                    onChange={handleChange}
                >
                    <MenuItem value={Gender.MALE}>Male</MenuItem>
                    <MenuItem value={Gender.FEMALE}>Female</MenuItem>
                </Select>
                {touched.gender && errors.gender && (
                    <FormHelperText error>{errors.gender}</FormHelperText>
                )}
            </FormControl>

            <Grid container alignItems="center" justifyContent="space-between" sx={{ mt: 1 }}>
                <Grid item>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={checked}
                                onChange={(e) => setChecked(e.target.checked)}
                                name="checked"
                                color="primary"
                            />
                        }
                        label={
                            <Typography variant="subtitle1">
                                Agree with &nbsp;
                                <Typography variant="subtitle1" component={Link} to="#">
                                    Terms & Condition.
                                </Typography>
                            </Typography>
                        }
                    />
                </Grid>
            </Grid>

            {errors.submit && (
                <Box sx={{ mt: 3 }}>
                    <FormHelperText error>{errors.submit}</FormHelperText>
                </Box>
            )}

            <Box sx={{ mt: 2 }}>
                <AnimateButton>
                    <Button
                        disableElevation
                        disabled={isSubmitting || !checked}
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                        color="secondary"
                    >
                        Sign up
                    </Button>
                </AnimateButton>
            </Box>
        </form>
    )}
</Formik>
        </>
    );
};

export default JWTRegister;
