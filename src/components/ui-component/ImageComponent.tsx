import { Avatar, Box, BoxProps } from '@mui/material';
import { useState } from 'react';

interface ImageProps extends BoxProps<'img'> {
    src?: string;
    alt: string;
}

export default function Image({ src, alt, sx, ...props }: ImageProps) {
    const [error, setError] = useState(false);

    // const initials = alt
    //     ?.split(' ')
    //     .map((word) => word[0])
    //     .join('')
    //     .slice(0, 2)
    //     .toUpperCase();

    // if (!src || error) {
    //     return <Avatar sx={sx}>{initials}</Avatar>;
    // }

    return (
        <Box
            component="img"
            src={src}
            alt={alt}
            loading="lazy"
            onError={() => setError(true)}
            sx={{
                display: 'block',
                maxWidth: '100%',
                height: 'auto',
                objectFit: 'contain',
                ...sx
            }}
            {...props}
        />
    );
}
