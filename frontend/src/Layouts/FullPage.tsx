import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import React from 'react';

interface IFullPage {
  children: JSX.Element;
}

export default function FullPage({ children }: IFullPage) {
  return (
    <Box sx={{bgcolor: 'primary.main', minHeight: '100vh'}}>
      <Grid container justifyContent='center' alignItems='center' sx={{width: 1 ,  minHeight: '100vh' }}>
        <Grid item xs='auto' sx={{maxWidth: 1, maxHeight: 1}}>
          {children}
        </Grid>
      </Grid>
    </Box>
  );
}
