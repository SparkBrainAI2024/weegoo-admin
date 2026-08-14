import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { IconX } from '@tabler/icons-react';
import carIcon from 'assets/images/car-icon.svg';
import shieldIcon from 'assets/images/shield.png';

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

const EmailTemplatePreviewModal = ({ open, onClose, title, content }: Props) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="lg"
            fullWidth
            PaperProps={{
                sx: {
                    bgcolor: 'transparent',
                    boxShadow: 'none',
                    overflow: 'visible'
                }
            }}
        >
            <Box
                sx={{
                    position: 'relative',
                    display: 'flex',
                    justifyContent: 'center',
                    p: 3,
                    bgcolor: '#f5f7fb',
                    borderRadius: 2
                }}
            >
                <IconButton
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        zIndex: 100,
                        bgcolor: '#fff',
                        boxShadow: 2,
                        '&:hover': {
                            bgcolor: '#fff'
                        }
                    }}
                >
                    <IconX size={18} />
                </IconButton>

                <Box
                    sx={{
                        width: '100%',
                        maxWidth: 760,
                        bgcolor: '#ffffff',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        border: '1px solid #D9E2F0',
                        boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
                        maxHeight: '90vh',
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >
                    {/* HEADER */}
                    <Box
                        sx={{
                            background: 'linear-gradient(135deg,#07122D 0%,#091A43 100%)',
                            px: 4,
                            py: 3,
                            minHeight: 120,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}
                    >
                        <Box>
                            <Typography
                                sx={{
                                    fontSize: '24px',
                                    fontWeight: 700,
                                    color: '#ffffff',
                                    lineHeight: 1
                                }}
                            >
                                <Box component="span" sx={{ color: '#FFC928' }}>
                                    Wee
                                </Box>
                                Goo
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 1,
                                    fontSize: '14px',
                                    color: '#D8DDEA'
                                }}
                            >
                                Your Ride. Your Way.
                            </Typography>
                        </Box>

                        <Box
                            component="img"
                            src={carIcon}
                            alt="WeeGoo"
                            sx={{
                                width: 110,
                                objectFit: 'contain'
                            }}
                        />
                    </Box>

                    {/* BODY */}
                    <Box
                        sx={{
                            overflowY: 'auto',
                            bgcolor: '#fff'
                        }}
                    >
                        {/* ICON + TITLE + CONTENT SECTION */}
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'flex-start',
                           
                                px: '12px',
                                pt: '24px',
                                pb: '32px'
                            }}
                        >
                            {/* Left column: shield icon, aligned at the top */}
                            <Box
                                component="img"
                                src={shieldIcon}
                                alt={title}
                                sx={{
                                    width: '48px',
                                    height: '48px',
                                    objectFit: 'contain',
                                    mixBlendMode: 'multiply',
                                    flexShrink: 0
                                }}
                            />

                            {/* Right column: title */}
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography
                                    sx={{
                                        fontSize: { xs: '24px', md: '28px' },
                                        fontWeight: 700,
                                        lineHeight: 1.2,
                                        color: '#0F172A',
                                        letterSpacing: '-1px',
                                        mt: '4px'
                                    }}
                                >
                                    {title}
                                </Typography>
                            </Box>
                        </Box>

                        {/* Content aligned to the same column as the shield icon */}
                        <Box
                            sx={{
                                px: '24px',
                                pb: '32px',
                                '& img': {
                                    maxWidth: '100%',
                                    height: 'auto'
                                },
                                '& table': {
                                    width: '100%'
                                },
                                '& p': {
                                    marginTop: 0
                                }
                            }}
                            dangerouslySetInnerHTML={{
                                __html: content
                            }}
                        />

                        {/* FOOTER */}
                        <Box
                            sx={{
                                textAlign: 'center',
                                pt: '8px',
                                pb: '20px',
                                px: '24px',
                                bgcolor: '#ffffff'
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: '16px',
                                    fontWeight: 400,
                                    color: '#0F172A',
                                    lineHeight: 1.4,
                                    textAlign: 'left'
                                }}
                            >
                                Regards,
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: '28px',
                                    fontWeight: 700,
                                    color: '#0F172A',
                                    lineHeight: 1.2,
                                    mt: '4px',
                                    textAlign: 'left'
                                }}
                            >
                                WeeGoo Team
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: '16px',
                                    fontWeight: 400,
                                    color: '#6B7280',
                                    mt: '10px',
                                    textAlign: 'left'
                                }}
                            >
                                We're here to get you there.
                            </Typography>

                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    gap: '20px',
                                    mt: '48px',
                                    mb: '24px'
                                }}
                            >
                                {[1, 2, 3, 4].map((item) => (
                                    <Box
                                        key={item}
                                        sx={{
                                            width: '18px',
                                            height: '18px',
                                            borderRadius: '50%',
                                            backgroundColor: '#07122D'
                                        }}
                                    />
                                ))}
                            </Box>

                            <Typography
                                sx={{
                                    fontSize: '14px',
                                    fontWeight: 400,
                                    color: '#6B7280',
                                    lineHeight: 1.4
                                }}
                            >
                                © 2026 WeeGoo. All rights reserved.
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Dialog>
    );
};

export default EmailTemplatePreviewModal;