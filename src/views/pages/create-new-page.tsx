import { Button, Box, Grid, Typography, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { InputField } from 'components/ui-component/forms/InputField';
import Breadcrumbs from 'components/ui-component/extended/Breadcrumbs';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate, useParams } from 'react-router';
import { useMutation, useQuery } from '@apollo/client/react';
import { CREATE_PAGE, UPDATE_PAGE } from 'graphql/mutations/page.mutations';
import { CreatePageResponse, PageBySlugResponse } from 'types/pages.response';
import useNotification from 'hooks/useNotification';
import { extractApiLevelError } from 'lib/apiError';
import { useEffect, useState } from 'react';
import { GET_PAGE_BY_SLUG, GET_PAGES } from 'graphql/queries/pages.queries';
import { PageType } from 'types/enum';

interface PageData {
    _id: string;
    title: string;
    status: string;
    content: string;
    updatedAt?: string;
}

const NewPage = () => {
    const navigate = useNavigate();
    const [createPage] = useMutation<CreatePageResponse>(CREATE_PAGE);
    const [updatePage] = useMutation(UPDATE_PAGE);
    const { showError, showSuccess } = useNotification();
    const { slug } = useParams();
    const isEditMode = Boolean(slug);

    const [pageData, setPageData] = useState<PageData | null>(null);
    const { data: pageQueryData } = useQuery<PageBySlugResponse>(GET_PAGE_BY_SLUG, {
        variables: { slug },
        skip: !isEditMode
    });

    useEffect(() => {
        if (pageQueryData?.pageBySlug) {
            setPageData(pageQueryData.pageBySlug);
        }
    }, [pageQueryData]);
    return (
        <>
            <Breadcrumbs
                custom
                title={false}
                links={[
                    { title: 'Page Management', to: '/page-management' },
                    { title: isEditMode ? pageData?.title ?? '...' : 'Add Page' }
                ]}
                card={false}
                rightAlign={false}
            />

            <Formik
                enableReinitialize
                initialValues={{
                    title: pageData?.title ?? '',
                    status: pageData?.status ?? 'DRAFT',
                    content: pageData?.content ?? ''
                }}
                validationSchema={Yup.object().shape({
                    title: Yup.string().required('Title is required'),
                    status: Yup.string().required('Status is required'),
                    content: Yup.string().required().min(5)
                })}
                onSubmit={async (values, { setSubmitting, setStatus }) => {
                    console.log('isEditMode:', isEditMode);
                    console.log('pageData:', pageData);
                    try {
                        if (isEditMode) {
                            await updatePage({
                                variables: {
                                    updatePageId: pageData?._id,
                                    input: {
                                        title: values.title,
                                        content: values.content,
                                        type: PageType.INFO
                                    }
                                },
                                refetchQueries: [
                                    {
                                        query: GET_PAGES,
                                        variables: {
                                            paginationInput: {
                                                page: 0,
                                                limit: 10
                                            }
                                        }
                                    }
                                ]
                            });
                            showSuccess('Page updated successfully');
                        } else {
                            await createPage({
                                variables: {
                                    input: {
                                        title: values.title,
                                        content: values.content,
                                        type: PageType.INFO
                                    }
                                },
                                refetchQueries: [
                                    {
                                        query: GET_PAGES,
                                        variables: {
                                            paginationInput: {
                                                page: 0,
                                                limit: 10
                                            }
                                        }
                                    }
                                ]
                            });
                            showSuccess('Page created successfully');
                        }
                        navigate('/page-management');
                    } catch (err: any) {
                        setStatus({ success: false });
                        setSubmitting(false);
                        showError(extractApiLevelError(err));
                    }
                }}
            >
                {({ handleSubmit, values, handleChange, setFieldValue }) => (
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <InputField name="title" label="Page Title" />
                            </Grid>

                            <Grid item xs={3}>
                                <FormControl fullWidth>
                                    <InputLabel>Status</InputLabel>
                                    <Select name="status" value={values.status} onChange={handleChange} label="Status">
                                        <MenuItem value="PUBLISHED">Published</MenuItem>
                                        <MenuItem value="DRAFT">Draft</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={3}>
                                <Typography variant="caption" color="text.secondary">
                                    Last Updated
                                </Typography>
                                <Typography variant="body1">
                                    {pageData?.updatedAt
                                        ? new Date(pageData.updatedAt).toLocaleString('en-US', {
                                              month: 'short',
                                              day: '2-digit',
                                              year: 'numeric',
                                              hour: '2-digit',
                                              minute: '2-digit'
                                          })
                                        : '—'}
                                </Typography>
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

                        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                            <Button variant="outlined" onClick={() => navigate('/page-management')}>
                                Cancel
                            </Button>
                            <Button variant="contained" color="inherit">
                                Preview
                            </Button>
                            <Button variant="contained" color="warning" type="submit">
                                Save Changes
                            </Button>
                        </Box>
                    </form>
                )}
            </Formik>
        </>
    );
};

export default NewPage;
