import { TextField } from '@mui/material';
import { FormikValues, useFormikContext } from 'formik';
import { useState } from 'react';

export const InputField = <T extends FormikValues>({ name, label, type = 'text' }: { name: keyof T; label: string; type?: string }) => {
    const formik = useFormikContext<T>();
    const touched = formik.touched?.[name];
    const error = formik.errors?.[name];
    const [shrink, setShrink] = useState(false);

    const value = formik.values[name] as string;

    return (
        <TextField
            fullWidth
            id={String(name)}
            name={String(name)}
            label={label}
            type={type}
            value={value || ''}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={Boolean(touched && error)}
            helperText={touched && (error as string)}
            InputLabelProps={{
                shrink: shrink || Boolean(value)
            }}
            inputProps={{
                onAnimationStart: (e: React.AnimationEvent<HTMLInputElement>) => {
                    if (e.animationName === 'mui-auto-fill') {
                        setShrink(true);
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
