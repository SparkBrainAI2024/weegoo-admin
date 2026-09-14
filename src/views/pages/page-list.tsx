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
import { GET_PAGES } from 'graphql/queries/pages.queries';
import { useQuery } from '@apollo/client/react';
import { Page, PagesResponse } from 'types/pages.response';
import { PAGE_STATUS_COLORS } from 'constants/pages';
import PagePreviewModal from 'components/ui-component/PagePreviewModal';

// ==============================|| PAGE ROW ||============================== //

const PageRow = ({ page }: { page: Page }) => {
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
                {/* Page Title */}
                <TableCell>
                    <Stack spacing={0.5}>
                        <Typography variant="subtitle1" fontWeight={500}>
                            {page.title}
                        </Typography>

                        <Typography variant="caption" color="text.secondary">
                            {page.title.toLowerCase()}
                        </Typography>
                    </Stack>
                </TableCell>

                {/* Slug */}
                <TableCell>
                    <Typography variant="body2" color="text.secondary">
                        {page.slug}
                    </Typography>
                </TableCell>

                {/* Type */}
                <TableCell>
                    <Typography variant="body2">{page.type.charAt(0) + page.type.slice(1).toLowerCase()}</Typography>
                </TableCell>

                {/* Status */}
                <TableCell>
                    <Chip
                        label={page.status.charAt(0) + page.status.slice(1).toLowerCase()}
                        size="small"
                        sx={{
                            borderRadius: '20px',
                            px: 1,
                            backgroundColor: PAGE_STATUS_COLORS[page.status].bg,
                            color: PAGE_STATUS_COLORS[page.status].text
                        }}
                    />
                </TableCell>

                {/* Updated */}
                <TableCell>
                    <Typography variant="body2" color="text.secondary">
                        {new Date(page.updatedAt).toLocaleDateString('en-US', {
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

                        <Button size="small" variant="contained" onClick={() => navigate(`/page-management/${page.slug}/edit`)}>
                            Edit
                        </Button>
                    </Stack>
                </TableCell>
            </TableRow>

            <PagePreviewModal open={previewOpen} onClose={() => setPreviewOpen(false)} title={page.title} content={page.content} />
        </>
    );
};

// ==============================|| PAGE MANAGEMENT LIST ||============================== //

const Content = () => {
    const navigate = useNavigate();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const { data, loading } = useQuery<PagesResponse>(GET_PAGES, {
        variables: {
            paginationInput: {
                page,
                limit: rowsPerPage
            }
        }
    });

    const pagesList: Page[] = data?.pages?.data || [];
    const total: number = data?.pages?.pagination?.total || 0;

    return (
        <Stack spacing={2}>
            {/* Top Action */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="contained" onClick={() => navigate('/page-management/add')}>
                    Create New Page
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
                            <TableRow
                                sx={{
                                    backgroundColor: '#EDEDED'
                                }}
                            >
                                <TableCell>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Page Title
                                    </Typography>
                                </TableCell>

                                <TableCell>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Slug
                                    </Typography>
                                </TableCell>

                                <TableCell>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Type
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
                                        {Array.from({ length: 6 }).map((__, j) => (
                                            <TableCell key={j}>
                                                <Skeleton variant="text" />
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : pagesList.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6}>
                                        <Typography variant="body2" color="text.secondary" sx={{ p: 2.5 }}>
                                            No pages found.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                pagesList.map((page) => <PageRow key={page.slug} page={page} />)
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

export default Content;
