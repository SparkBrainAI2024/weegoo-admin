import Pagination from '@mui/material/Pagination';
import { TablePaginationActionsProps } from '@mui/material/TablePagination/TablePaginationActions';
export const CustomPaginationActions = ({ className, count, page, rowsPerPage, onPageChange }: TablePaginationActionsProps) => {
    const pageCount = Math.ceil(count / rowsPerPage);
    return (
        <Pagination
            className={className}
            count={pageCount}
            page={page + 1} // MUI Pagination is 1-based, TablePagination is 0-based
            onChange={(_, newPage) => onPageChange(null, newPage - 1)}
            shape="rounded"
            sx={{
                '& .MuiPaginationItem-root.Mui-selected': {
                    backgroundColor: '#439A47',
                    color: '#fff',
                    '&:hover': {
                        backgroundColor: 'secondary.dark'
                    }
                }
            }}
        />
    );
};
