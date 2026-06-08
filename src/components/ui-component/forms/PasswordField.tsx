import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { FormikValues, useFormikContext } from "formik";
import { useState } from "react";

const PasswordField = <T extends FormikValues>({ name, label }: { name: keyof T, label: string }) => {
  const formik = useFormikContext<T>();
  const touched = formik.touched?.[name];
  const error = formik.errors?.[name];
  const [showPassword, setShowPassword] = useState(false);

  return (
    <TextField
      fullWidth
      id={String(name)}
      name={String(name)}
      label={label}
      type={showPassword ? 'text' : 'password'}
      value={formik.values[name]}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      error={touched && Boolean(error)}
      helperText={touched && error as string}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        )
      }}
    />
  );
};