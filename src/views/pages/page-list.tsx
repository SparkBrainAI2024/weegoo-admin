import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TablePagination from '@mui/material/TablePagination';

// graphql
import { GET_PAGES } from 'graphql/queries/pages.queries';
import { useQuery } from '@apollo/client/react';
import { Page, PagesResponse } from 'types/pages.response';



// ==============================|| STATUS BADGE ||============================== //

const STATUS_COLORS = {
    PUBLISHED: { bg: '#BFE6C4', text: '#30B010' },
    DRAFT: { bg: '#E0E0E0', text: '#616161' },
}



// ==============================|| HEADER ROW ||============================== //

const TableHeader = () => (
    <Box sx={{
        bgcolor: '#EDEDED',
        px: 3,
        py: 1.5,
        borderRadius: '8px 8px 0 0'
    }}>
        <Grid container alignItems="center">
            <Grid item xs={3}>
                <Typography variant="subtitle2" color="text.secondary">
                    Page Title
                </Typography>
            </Grid>
            <Grid item xs={2}>
                <Typography variant="subtitle2" color="text.secondary">
                    Slug
                </Typography>
            </Grid>
            <Grid item xs={2}>
                <Typography variant="subtitle2" color="text.secondary">
                    Type
                </Typography>
            </Grid>
            <Grid item xs={2}>
                <Typography variant="subtitle2" color="text.secondary">
                    Status
                </Typography>
            </Grid>
            <Grid item xs={2}>
                <Typography variant="subtitle2" color="text.secondary">
                    Updated
                </Typography>
            </Grid>
            <Grid item xs={1}>
                <Typography variant="subtitle2" color="text.secondary">
                    Action
                </Typography>
            </Grid>
        </Grid>
    </Box>
);

// ==============================|| PAGE ROW ||============================== //

const PageRow = ({ page }: { page: Page }) => {
    const navigate = useNavigate();

    return (
        <Card sx={{
            px: 3,
            py: 2,
            borderRadius: 1,
            boxShadow: 'none',
            border: '1px solid',
            borderColor: 'grey.100',
            '&:hover': { bgcolor: 'grey.50' }
        }}>
            <Grid container alignItems="center">
                <Grid item xs={3}>
                    <Stack spacing={0.5}>
                        <Typography variant="subtitle1" fontWeight={500}>
                            {page.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {page.title.toLowerCase()}
                        </Typography>
                    </Stack>
                </Grid>
                <Grid item xs={2}>
                    <Typography variant="body2" color="text.secondary">
                        {page.slug}
                    </Typography>
                </Grid>
                <Grid item xs={2}>
                    <Typography variant="body2">
                        {page.type.charAt(0) + page.type.slice(1).toLowerCase()}
                    </Typography>
                </Grid>
                <Grid item xs={2}>
                    <Chip
                        label={page.status.charAt(0) + page.status.slice(1).toLowerCase()}
                        size="small"
                        sx={{
                            borderRadius: '20px', p: 2, backgroundColor: STATUS_COLORS[page.status].bg,
                            color: STATUS_COLORS[page.status].text,
                        }}
                    />
                </Grid>
                <Grid item xs={2}>
                    <Typography variant="body2" color="text.secondary">
                        {new Date(page.updatedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: '2-digit',
                            year: 'numeric'
                        })}
                    </Typography>
                </Grid>
                <Grid item xs={1}>
                    <Stack direction="row" spacing={1}>
                        <Button
                            size="small"
                            variant="outlined"
                            onClick={() => navigate(`/content/${page.slug}`)}
                        >
                            View
                        </Button>
                        <Button
                            size="small"
                            variant="contained"
                            onClick={() => navigate(`/content/${page.slug}/edit`)}
                        >
                            Edit
                        </Button>
                    </Stack>
                </Grid>
            </Grid>
        </Card>
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
                <Button
                    variant="contained"
                    onClick={() => navigate('/content/create')}
                >
                    Create New Page
                </Button>
            </Box>

            {/* Table */}
            <Box sx={{ borderRadius: 2, border: '1px solid', borderColor: 'grey.100' }}>

             <Box sx={{ overflowX: 'auto' }}>
                 <Box sx={{minWidth:1500}}>

                      <TableHeader />

                <Stack spacing={1} sx={{ p: 1 }}>
                    {loading ? (
                        <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
                            Loading...
                        </Typography>
                    ) : pagesList.length === 0 ? (
                        <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
                            No pages found.
                        </Typography>
                    ) : (
                        pagesList.map((page, index) => (
                            <PageRow key={index} page={page} />
                        ))
                    )}
                </Stack>
                 </Box>

             </Box>
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