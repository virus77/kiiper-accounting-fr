import React from 'react';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';

const util = {
    Copyright: function () {
        return (
            <Typography variant="body2" color="textSecondary" align="center">
                {'Copyright © '}
                <Link color="inherit" href="/getConsentUrl">
                    Kipper
            </Link>{' '}
                {new Date().getFullYear()}
                {'.'}
            </Typography>
        );
    },
}

export default util;