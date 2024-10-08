import React, { useState } from 'react';
import { Box, Grid } from '@mui/material';
import EmailList from './email.js'; // Assuming EmailList is in the same directory
import DisplayEmails from './displayemail'; // Assuming DisplayEmails is in the same directory

function EmailManager() {
    const [emailRefreshTrigger, setEmailRefreshTrigger] = useState(false);

    // Function to trigger email refresh after a new email is added
    const handleEmailAdded = () => {
        setEmailRefreshTrigger((prev) => !prev);
    };

    return (
        <Grid container spacing={4} sx={{ height: '100vh', padding: 2 }}>
            <Grid item xs={12} md={6}>
                <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <EmailList onEmailAdded={handleEmailAdded} />
                </Box>
            </Grid>
            <Grid item xs={12} md={6}>
                <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <DisplayEmails emailRefreshTrigger={emailRefreshTrigger} />
                </Box>
            </Grid>
        </Grid>
    );
}

export default EmailManager;
