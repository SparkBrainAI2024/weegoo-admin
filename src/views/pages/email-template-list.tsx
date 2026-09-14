import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';

// graphql
import { GET_EMAIL_TEMPLATES } from 'graphql/queries/email-templates.queries';
import { useQuery } from '@apollo/client/react';
import { EmailTemplate, EmailTemplatesResponse } from 'types/email-templates.response';
import { EMAIL_TEMPLATE_STATUS_COLORS } from 'constants/email-templates';
import EmailTemplatePreviewModal from 'components/ui-component/EmailTemplatePreviewModal';

// ==============================|| EMAIL TEMPLATE ROW ||============================== //

const EmailTemplateRow = ({ template }: { template: EmailTemplate }) => {
    const navigate = useNavigate();
    const [previewOpen, setPreviewOpen] = useState(false);

    return (
        <>
            <TableRow
                hover
                sx={{
                    '&:last-child td': {
                        borderBottom: 0
                    }
                }}
            >
                {/* Template Title */}
                <TableCell>
                    <Stack spacing={0.5}>
                        <Typography variant="subtitle1" fontWeight={500}>
                            {template.title}
                        </Typography>

                        <Typography variant="caption" color="text.secondary">
                            {template.title.toLowerCase()}
                        </Typography>
                    </Stack>
                </TableCell>

                {/* Slug */}
                <TableCell>
                    <Typography variant="body2" color="text.secondary">
                        {template.slug}
                    </Typography>
                </TableCell>

                {/* Status */}
                <TableCell>
                    <Chip
                        label={template.status.charAt(0) + template.status.slice(1).toLowerCase()}
                        size="small"
                        sx={{
                            borderRadius: '20px',
                            px: 1,
                            backgroundColor: EMAIL_TEMPLATE_STATUS_COLORS[template.status].bg,
                            color: EMAIL_TEMPLATE_STATUS_COLORS[template.status].text
                        }}
                    />
                </TableCell>

                {/* Updated */}
                <TableCell>
                    <Typography variant="body2" color="text.secondary">
                        {new Date(template.updatedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: '2-digit',
                            year: 'numeric'
                        })}
                    </Typography>
                </TableCell>

                {/* Actions */}
                <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Button size="small" variant="outlined" onClick={() => setPreviewOpen(true)}>
                            View
                        </Button>

                        <Button size="small" variant="contained" onClick={() => navigate(`/email-template/${template._id}/edit`)}>
                            Edit
                        </Button>
                    </Stack>
                </TableCell>
            </TableRow>

            <EmailTemplatePreviewModal
                open={previewOpen}
                onClose={() => setPreviewOpen(false)}
                title={template.title}
                content={template.pageContent}
            />
        </>
    );
};

// ==============================|| EMAIL TEMPLATE MANAGEMENT LIST ||============================== //

const EmailTemplateList = () => {
    const navigate = useNavigate();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const { data, loading } = useQuery<EmailTemplatesResponse>(GET_EMAIL_TEMPLATES, {
        variables: {
            paginationInput: {
                page,
                limit: rowsPerPage
            }
        }
    });

    const templatesList: EmailTemplate[] = data?.emailTemplates?.data || [];

    const total: number = data?.emailTemplates?.pagination?.total || 0;

    return (
        <Stack spacing={2}>
            {/* Top Action */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="contained" onClick={() => navigate('/email-template/add')}>
                    Create New Template
                </Button>
            </Box>

            {/* Table */}
            <Box
                sx={{
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'grey.100',
                    overflow: 'hidden'
                }}
            >
                <TableContainer sx={{ overflowX: 'auto' }}>
                    <Table sx={{ minWidth: 900 }}>
                        {/* Header */}
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#EDEDED' }}>
                                <TableCell>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Template Title
                                    </Typography>
                                </TableCell>

                                <TableCell>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Slug
                                    </Typography>
                                </TableCell>

                                <TableCell>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Status
                                    </Typography>
                                </TableCell>

                                <TableCell>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Updated
                                    </Typography>
                                </TableCell>

                                <TableCell align="right">
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Action
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        {/* Body */}
                        <TableBody>
                            {loading ? (
                                Array.from({ length: rowsPerPage }).map((_, i) => (
                                    <TableRow key={i}>
                                        {Array.from({ length: 5 }).map((__, j) => (
                                            <TableCell key={j}>
                                                <Skeleton variant="text" />
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : templatesList.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5}>
                                        <Typography variant="body2" color="text.secondary" sx={{ p: 2.5 }}>
                                            No email templates found.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                templatesList.map((template) => <EmailTemplateRow key={template._id} template={template} />)
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Pagination */}
                <TablePagination
                    component="div"
                    count={total}
                    page={page}
                    onPageChange={(_, newPage) => setPage(newPage)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={(e) => {
                        setRowsPerPage(parseInt(e.target.value, 10));
                        setPage(0);
                    }}
                    rowsPerPageOptions={[10, 25, 50]}
                />
            </Box>
        </Stack>
    );
};

export default EmailTemplateList;
