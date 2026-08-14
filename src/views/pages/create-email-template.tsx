import { Button, Box, Grid, Typography, MenuItem, TextField, Stack } from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { InputField } from 'components/ui-component/forms/InputField';
import Breadcrumbs from 'components/ui-component/extended/Breadcrumbs';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate, useParams } from 'react-router';
import { useMutation, useQuery } from '@apollo/client/react';
import { CREATE_EMAIL_TEMPLATE, UPDATE_EMAIL_TEMPLATE } from 'graphql/mutations/email-template.mutations';
import { CreateEmailTemplateResponse, EmailTemplateByIdResponse } from 'types/email-templates.response';
import useNotification from 'hooks/useNotification';
import { extractApiLevelError } from 'lib/apiError';
import { useEffect, useState } from 'react';
import { GET_EMAIL_TEMPLATE_BY_ID, GET_EMAIL_TEMPLATES } from 'graphql/queries/email-templates.queries';
import EmailTemplatePreviewModal from 'components/ui-component/EmailTemplatePreviewModal';
import { ROUTES } from 'constants/routes';

interface EmailTemplateData {
    _id: string;
    title: string;
    status: string;
    pageContent: string;
    updatedAt?: string;
}

const Embed = Quill.import('blots/embed') as any;
const Delta = Quill.import('delta') as any;
class SmartBreak extends Embed {
    static blotName = 'smartBreak';
    static tagName = 'BR';
}

Quill.register(SmartBreak);

function matchSmartBreak() {
    return new Delta().insert({ smartBreak: true });
}

const quillModules = {
    toolbar: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image'],
        ['clean']
    ],
    clipboard: {
        matchVisual: false, // stop Quill injecting extra empty <p><br></p>
        matchers: [['BR', matchSmartBreak]]
    },
    keyboard: {
        bindings: {
            smartBreak: {
                key: 'Enter',
                shiftKey: true,
                handler(range: { index: number }) {
                    // @ts-ignore
                    this.quill.insertEmbed(range.index, 'smartBreak', true, 'user');
                    // @ts-ignore
                    this.quill.setSelection(range.index + 1, Quill.sources.SILENT);
                    return false;
                }
            }
        }
    }
};

const NewEmailTemplate = () => {
    const navigate = useNavigate();
    const [createEmailTemplate] = useMutation<CreateEmailTemplateResponse>(CREATE_EMAIL_TEMPLATE);
    const [updateEmailTemplate] = useMutation(UPDATE_EMAIL_TEMPLATE);
    const { showError, showSuccess } = useNotification();
    const { id } = useParams();
    const isEditMode = Boolean(id);
    const [previewOpen, setPreviewOpen] = useState(false);

    const [templateData, setTemplateData] = useState<EmailTemplateData | null>(null);
    const { data: templateQueryData } = useQuery<EmailTemplateByIdResponse>(GET_EMAIL_TEMPLATE_BY_ID, {
        variables: { emailTemplateId: id },
        skip: !isEditMode
    });
    useEffect(() => {
        if (templateQueryData?.emailTemplate) {
            setTemplateData(templateQueryData.emailTemplate);
        }
    }, [templateQueryData]);

    return (
        <>
            <Breadcrumbs
                custom
                title={false}
                links={[
                    { title: 'Email Template', to: '/email-template' },
                    { title: isEditMode ? templateData?.title ?? '...' : 'Add Template' }
                ]}
                card={false}
                rightAlign={false}
            />

            <Formik
                enableReinitialize
                initialValues={{
                    title: templateData?.title ?? '',
                    status: templateData?.status ?? 'DRAFT',
                    content: templateData?.pageContent ?? ''
                }}
                validationSchema={Yup.object().shape({
                    title: Yup.string().required('Title is required'),
                    status: Yup.string().required('Status is required'),
                    content: Yup.string().required().min(24, 'Content must be at least 24 characters long')
                })}
                onSubmit={() => {}}
            >
                {({ handleChange, values, setFieldValue, validateForm, setSubmitting, setTouched, errors, touched }) => {
                    const handleSave = async (status: 'DRAFT' | 'PUBLISHED') => {
                        const errors = await validateForm();

                        if (Object.keys(errors).length > 0) {
                            // mark all fields touched so InputField shows the errors
                            setTouched(
                                Object.keys(errors).reduce(
                                    (acc, key) => {
                                        acc[key] = true;
                                        return acc;
                                    },
                                    {} as Record<string, boolean>
                                )
                            );
                            return;
                        }

                        setSubmitting(true);
                        try {
                            if (isEditMode) {
                                await updateEmailTemplate({
                                    variables: {
                                        updateEmailTemplateId: templateData?._id,
                                        input: {
                                            title: values.title,
                                            pageContent: values.content,
                                            status
                                        }
                                    },
                                    refetchQueries: [
                                        {
                                            query: GET_EMAIL_TEMPLATES,
                                            variables: {
                                                paginationInput: {
                                                    page: 0,
                                                    limit: 10
                                                }
                                            }
                                        }
                                    ]
                                });
                                showSuccess('Email template updated successfully');
                            } else {
                                await createEmailTemplate({
                                    variables: {
                                        input: {
                                            title: values.title,
                                            pageContent: values.content,
                                            status
                                        }
                                    },
                                    refetchQueries: [
                                        {
                                            query: GET_EMAIL_TEMPLATES,
                                            variables: {
                                                paginationInput: {
                                                    page: 0,
                                                    limit: 10
                                                }
                                            }
                                        }
                                    ]
                                });
                                showSuccess(
                                    status === 'PUBLISHED' ? 'Email template published successfully' : 'Email template saved as draft'
                                );
                            }
                            navigate(ROUTES.EMAIL_TEMPLATE);
                        } catch (err: any) {
                            showError(extractApiLevelError(err));
                        } finally {
                            setSubmitting(false);
                        }
                    };

                    return (
                        <>
                            <form>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Stack spacing={1}>
                                            <Typography variant="caption" color="text.secondary">
                                                Email Title
                                            </Typography>
                                            <TextField
                                                fullWidth
                                                name="title"
                                                value={values.title}
                                                onChange={handleChange}
                                                error={touched.title && Boolean(errors.title)}
                                                helperText={touched.title && errors.title}
                                            />
                                        </Stack>
                                    </Grid>

                                    <Grid item xs={3}>
                                        <Stack spacing={1}>
                                            <Typography variant="caption" color="text.secondary">
                                                Status
                                            </Typography>
                                            <TextField
                                                select
                                                fullWidth
                                                name="status"
                                                value={values.status}
                                                onChange={handleChange}
                                                error={touched.status && Boolean(errors.status)}
                                                helperText={touched.status && errors.status}
                                            >
                                                <MenuItem value="DRAFT">Draft</MenuItem>
                                                <MenuItem value="PUBLISHED">Published</MenuItem>
                                            </TextField>
                                        </Stack>
                                    </Grid>

                                    <Grid item xs={3}>
                                        <Stack spacing={1}>
                                            <Typography variant="caption" color="text.secondary">
                                                Last Updated
                                            </Typography>
                                            <TextField
                                                fullWidth
                                                disabled
                                                value={
                                                    templateData?.updatedAt
                                                        ? new Date(templateData.updatedAt).toLocaleString('en-US', {
                                                              month: 'short',
                                                              day: '2-digit',
                                                              year: 'numeric',
                                                              hour: '2-digit',
                                                              minute: '2-digit'
                                                          })
                                                        : '—'
                                                }
                                            />
                                        </Stack>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <ReactQuill
                                            value={values.content}
                                            onChange={(val) => setFieldValue('content', val)}
                                            theme="snow"
                                            modules={quillModules}
                                            style={{ height: '300px', marginBottom: '42px' }}
                                        />
                                        {touched.content && errors.content && (
                                            <Typography variant="caption" color="error" sx={{ display: 'block', mt: 0.5 }}>
                                                {errors.content}
                                            </Typography>
                                        )}
                                    </Grid>
                                </Grid>

                                <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                                    <Button
                                        variant="contained"
                                        color="inherit"
                                        onClick={() => navigate(ROUTES.EMAIL_TEMPLATE)}
                                        sx={{ minWidth: 120 }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="inherit"
                                        onClick={() => setPreviewOpen(true)}
                                        sx={{
                                            bgcolor: 'black',
                                            color: 'white',
                                            minWidth: 120,
                                            '&:hover': { bgcolor: 'grey.300', color: 'black' }
                                        }}
                                    >
                                        Preview
                                    </Button>

                                    {isEditMode ? (
                                        <Button
                                            variant="contained"
                                            color="success"
                                            sx={{ bgcolor: 'primary.main', minWidth: 140 }}
                                            onClick={() => handleSave(values.status as 'DRAFT' | 'PUBLISHED')}
                                        >
                                            Save changes
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="contained"
                                            color="success"
                                            sx={{ bgcolor: 'primary.main', minWidth: 140 }}
                                            onClick={() => handleSave(values.status as 'DRAFT' | 'PUBLISHED')}
                                        >
                                            Save
                                        </Button>
                                    )}
                                </Box>
                            </form>
                            <EmailTemplatePreviewModal
                                open={previewOpen}
                                onClose={() => setPreviewOpen(false)}
                                title={values.title}
                                content={values.content}
                            />
                        </>
                    );
                }}
            </Formik>
        </>
    );
};

export default NewEmailTemplate;