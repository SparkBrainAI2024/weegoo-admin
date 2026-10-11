import { Visibility, VisibilityOff } from '@mui/icons-material';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import { FormikValues, useFormikContext } from 'formik';
import { useState } from 'react';

export const PasswordField = <T extends FormikValues>({
    name,
    label,
    onChange
}: {
    name: keyof T;
    label: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
    const formik = useFormikContext<T>();
    const touched = formik.touched?.[name];
    const error = formik.errors?.[name];
    const [showPassword, setShowPassword] = useState(false);
    const [shrink, setShrink] = useState(false);

    const value = formik.values[name] as string;

    return (
        <TextField
            fullWidth
            id={String(name)}
            name={String(name)}
            label={label}
            type={showPassword ? 'text' : 'password'}
            value={value}
            onChange={onChange || formik.handleChange}
            onBlur={formik.handleBlur}
            error={Boolean(touched && error)}
            helperText={touched && (error as string)}
            // This controls the floating label
            InputLabelProps={{
                shrink: shrink || Boolean(value)
            }}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                )
            }}
            // Put the autofill detection on the native input
            inputProps={{
                onAnimationStart: (e: React.AnimationEvent<HTMLInputElement>) => {
                    if (e.animationName === 'mui-auto-fill') {
                        setShrink(true);
                        // Also update Formik value (important)
                        formik.setFieldValue(String(name), e.currentTarget.value);
                    }
                },
                onAnimationEnd: (e: React.AnimationEvent<HTMLInputElement>) => {
                    if (e.animationName === 'mui-auto-fill-cancel') {
                        setShrink(false);
                    }
                }
            }}
        />
    );
};
