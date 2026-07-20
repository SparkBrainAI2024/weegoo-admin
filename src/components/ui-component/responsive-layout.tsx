import { Box, Table } from '@mui/material';
import { ReactNode } from 'react';

type ResponsiveTableLayoutCustomProps = {
    children: ReactNode;
};

const ResponsiveTableLayoutCustom = ({ children }: ResponsiveTableLayoutCustomProps) => {
    return (
        <Box
            sx={(theme) => ({
                overflowX: 'hidden',
                [theme.breakpoints.down(900)]: {
                    overflowX: 'auto'
                }
            })}
        >
            <Table
                sx={(theme) => ({
                    tableLayout: 'fixed',
                    width: '100%',
                    [theme.breakpoints.down(900)]: {
                        tableLayout: 'auto',
                        minWidth: 720 // Pick whatever width keeps columns readable.
                    }
                })}
            >
                {children}
            </Table>
        </Box>
    );
};

export default ResponsiveTableLayoutCustom;
