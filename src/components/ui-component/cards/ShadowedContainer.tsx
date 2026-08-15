// material-ui
import Card from '@mui/material/Card';

import { ReactNode } from 'react';

const ShadowedCardContainer = ({ children }: { children: ReactNode }) => {
    return (
        <Card
            sx={{
                position: 'relative',
                color: 'background.default',
                borderRadius: 4,
                boxShadow: '0 6px 6px -4px rgba(0, 0, 0, 0.4)',
                height: '100%',
                width: '100%'
            }}
        >
            {children}
        </Card>
    );
};

export default ShadowedCardContainer;
