import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import React from 'react';

interface ILandingPageCard {
  children:any
  cardTitle: string;
  cardSubtitle: string;
}

export default function LandingPageCard({ children, cardTitle, cardSubtitle }: ILandingPageCard) {
  return (
    <Box sx={{m: '16px'}}>
      <Paper elevation={6} sx={{ p: '30px' }}>
        <Paper elevation={6} sx={{ bgcolor: 'primary.main', p: '12px', mb: '80px', maxWidth: '500px' }}>
          <Typography variant='h4' sx={{ color: 'white' }}>
            {cardTitle}
          </Typography>
        </Paper>
        <Stack spacing={3} direction='column'>
          <Stack direction='row' justifyContent='center'>
            <Typography variant='h4'>{cardSubtitle}</Typography>
          </Stack>
          {children}
        </Stack>
      </Paper>
    </Box>
  );
}
