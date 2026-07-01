import { Button, Box, Grid, Typography, Chip } from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { InputField } from 'components/ui-component/forms/InputField';
import Breadcrumbs from 'components/ui-component/extended/Breadcrumbs';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate, useParams } from 'react-router';
import { useMutation, useQuery } from '@apollo/client/react';
import { CREATE_PAGE, PUBLISH_PAGE, UPDATE_PAGE } from 'graphql/mutations/page.mutations';
import { CreatePageResponse, PageBySlugResponse } from 'types/pages.response';
import useNotification from 'hooks/useNotification';
import { extractApiLevelError } from 'lib/apiError';
import { useEffect, useState } from 'react';
import { GET_PAGE_BY_SLUG, GET_PAGES } from 'graphql/queries/pages.queries';
import { PageType } from 'types/enum';
import { PAGE_STATUS_COLORS } from 'constants/pages';
import PagePreviewModal from 'components/ui-component/PagePreviewModal';
import { ROUTES } from 'constants/routes';

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
    const [previewOpen, setPreviewOpen] = useState(false);
    const [publishPage] = useMutation(PUBLISH_PAGE);

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
                    <>
                        {' '}
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <InputField name="title" label="Page Title" />
                                </Grid>

                                <Grid item xs={3}>
                                    <Box sx={{ mt: 0.5 }}>
                                        <Typography variant="caption" color="text.secondary">
                                            Status
                                        </Typography>{' '}
                                        <Chip
                                            label={values.status.charAt(0) + values.status.slice(1).toLowerCase()}
                                            size="small"
                                            sx={{
                                                borderRadius: '20px',
                                                p: 2,
                                                backgroundColor: PAGE_STATUS_COLORS[values.status as keyof typeof PAGE_STATUS_COLORS]?.bg,
                                                color: PAGE_STATUS_COLORS[values.status as keyof typeof PAGE_STATUS_COLORS]?.text
                                            }}
                                        />
                                    </Box>
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

                                <Grid
                                    item
                                    xs={12}
                                    onKeyDownCapture={(e) => {
                                        if (e.code === 'Enter' && e.shiftKey) {
                                            e.preventDefault();
                                        }
                                    }}
                                >
                                    <ReactQuill
                                        value={values.content}
                                        onChange={(val) => setFieldValue('content', val)}
                                        theme="snow"
                                        style={{ height: '300px', marginBottom: '42px' }}
                                    />
                                </Grid>
                            </Grid>

                            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                                <Button variant="contained" color="inherit" onClick={() => navigate(ROUTES.PAGE_MANAGEMENT)}>
                                    Cancel
                                </Button>
                                <Button
                                    variant="contained"
                                    color="inherit"
                                    onClick={() => setPreviewOpen(true)}
                                    sx={{ bgcolor: 'black', color: 'white' }}
                                >
                                    Preview
                                </Button>
                                {isEditMode && (
                                    <Button
                                        variant="contained"
                                        color="success"
                                        sx={{ bgcolor: 'primary.main' }}
                                        onClick={async () => {
                                            try {
                                                await publishPage({
                                                    variables: { publishPageId: pageData?._id },
                                                    refetchQueries: ['GET_PAGES', 'PageBySlug']
                                                });
                                                showSuccess('Page published successfully');
                                            } catch (err: any) {
                                                showError(extractApiLevelError(err));
                                            }
                                        }}
                                    >
                                        Publish
                                    </Button>
                                )}
                                <Button variant="contained" color="warning" type="submit">
                                    Save Changes
                                </Button>
                            </Box>
                        </form>
                        <PagePreviewModal
                            open={previewOpen}
                            onClose={() => setPreviewOpen(false)}
                            title={values.title}
                            content={values.content}
                        />
                    </>
                )}
            </Formik>
        </>
    );
};

export default NewPage;
