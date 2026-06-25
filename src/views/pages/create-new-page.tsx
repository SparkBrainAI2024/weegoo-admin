import { Button, Box, Grid, Typography, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { Formik } from "formik";
import * as Yup from "yup";
import { InputField } from "components/ui-component/forms/InputField";
import Breadcrumbs from "components/ui-component/extended/Breadcrumbs";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from "react-router";
import { useMutation } from "@apollo/client/react";
import { CREATE_PAGE } from "graphql/mutations/page.mutations";
import { CreatePageResponse } from "types/pages.response";
import useNotification from "hooks/useNotification";
import { extractApiLevelError } from "lib/apiError";


const NewPage = () => {
      const navigate = useNavigate();
    const [createPage] = useMutation<CreatePageResponse>(CREATE_PAGE);
    const { notification, showError, showSuccess, clearNotification } = useNotification();

    return (
        <>
            <Breadcrumbs
                custom
                heading="Page Management"
                links={[
                    { title: 'Content', to: '/content' },
                    { title: 'Page Management' }
                ]}
            />

            <Formik
                initialValues={{
                    title: '',
                    status: 'DRAFT',
                    content: ''
                }}
                validationSchema={Yup.object().shape({
                    title: Yup.string().required('Title is required'),
                    status: Yup.string().required('Status is required'),
                })}
                onSubmit={async (values, { setStatus, setSubmitting }) => {
     try{   const result = await createPage({
            variables: {
                input: {
                    title: values.title,
                    content: values.content,
                    status: values.status,
                    type: 'STATIC'
                }
            }
        });
        setStatus({ success: true });
        setSubmitting(false);
        showSuccess('Page created successfully');
        navigate('/content');
    } catch (err: any) {
        setStatus({ success: false });
        setSubmitting(false);
        showError(extractApiLevelError(err));
    }                }}
            >
                {({ handleSubmit, values, handleChange, setFieldValue }) => (
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>

                            {/* Page Title */}
                            <Grid item xs={6}>
                                <InputField name="title" label="Page Title" />
                            </Grid>

                            {/* Status */}
                            <Grid item xs={3}>
                                <FormControl fullWidth>
                                    <InputLabel>Status</InputLabel>
                                    <Select name="status" value={values.status} onChange={handleChange} label="Status">
                                        <MenuItem value="PUBLISHED">Published</MenuItem>
                                        <MenuItem value="DRAFT">Draft</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* Last Updated */}
                            <Grid item xs={3}>
                                <Typography variant="caption" color="text.secondary">Last Updated</Typography>
                                <Typography variant="body1">Feb 08, 2026 • 12:45 PM</Typography>
                            </Grid>
                                                    <Grid item xs={12}>


<ReactQuill
    value={values.content}
    onChange={(val) => setFieldValue('content', val)}
    theme="snow"
     style={{ height: '300px', marginBottom: '42px' }}
/>
                                                    </Grid>


                        </Grid>

                        {/* Action Buttons */}
                        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                            <Button variant="outlined">Cancel</Button>
                            <Button variant="contained" color="inherit">Preview</Button>
                            <Button variant="contained" color="warning" type="submit">Save Changes</Button>
                        </Box>
                    </form>
                )}
            </Formik>
        </>
    );
};

export default NewPage;