import { TextField } from "@mui/material";
import { FormikValues, useFormikContext } from "formik";

export const InputField = <T extends FormikValues>({ name, label, type = 'text' }: { name: keyof T, label: string, type?: string }) => {
  const formik = useFormikContext<T>();
  const touched = formik.touched?.[name];
  const error = formik.errors?.[name];

  return (
    <TextField
      fullWidth
      id={String(name)}
      name={String(name)}
      label={label}
      type={type}
      value={formik.values[name]}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      error={touched && Boolean(error)}
      helperText={touched && error as string}
    />
  );
};