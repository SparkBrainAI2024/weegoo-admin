import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface Props {
    open: boolean;
    onClose: () => void;
    title: string;
    content: string;
}

const PagePreviewModal = ({ open, onClose, title, content }: Props) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogContent sx={{ p: 0 }}>
                {/* mobile frame */}
                <Box
                    sx={{
                        mx: 'auto',
                        my: 2,
                        width: 320,
                        minHeight: 560,
                        border: '8px solid #222',
                        borderRadius: '36px',
                        overflow: 'hidden',
                        boxShadow: '0 0 0 2px #555',
                        bgcolor: '#fff',
                        position: 'relative'
                    }}
                >
                    {/* mobile status bar */}
                    <Box sx={{ bgcolor: '#f5f5f5', px: 2, py: 1, borderBottom: '1px solid #eee' }}>
                        <Typography variant="subtitle2" fontWeight={600}>
                            {title}
                        </Typography>
                    </Box>

                    {/* content */}
                    <Box sx={{ p: 2, overflowY: 'auto', maxHeight: 480, fontSize: '13px' }} dangerouslySetInnerHTML={{ __html: content }} />
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default PagePreviewModal;
