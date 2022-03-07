import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';

import React, { useState } from 'react';
import { useImmer } from 'use-immer';
import SignUpForm from '../Components/User/SignUp/SignUpForm';
import useAuth from '../Hooks/useAuth';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

const nameCapitalized = (name: string) => name.charAt(0).toUpperCase() + name.slice(1);

export default function UserDetails() {
  const auth = useAuth();
  const [open, setOpen] = useState(false);
  const userContext = auth?.user!;

  const [user, setUser] = useImmer<any>(userContext);

  const handleOnChange = (e: any) => {
    const field = e.target.id;
    setUser((draft: any) => {
      draft[field] = e.target.value;
    });
  };

  return (
    <Box>
      <Stack direction='column' spacing={3}>
        <Typography variant='h4'>User Profile</Typography>
        <Paper elevation={6} sx={{ p: '20px', width: '50%' }}>
          <Stack direction='column' spacing={3}>
            <Typography variant='h6'>Edit Profile</Typography>

            <TextField
              id='firstName'
              label='First Name'
              variant='outlined'
              onChange={handleOnChange}
              value={nameCapitalized(user?.firstName!)}
            />
            <TextField
              id='lastName'
              label='Last Name'
              variant='outlined'
              onChange={handleOnChange}
              value={nameCapitalized(user?.lastName!)}
            />
            <TextField id='email' label='Email' variant='outlined' onChange={handleOnChange} value={user?.email!} />
            <TextField id='role' label='Role' variant='outlined' onChange={handleOnChange} value={user?.role!} />
          </Stack>
        </Paper>
        {userContext.role === 'ADMIN' && (
          <>
            <Divider />
            <Box sx={{ width: '50%' }}>
              <Paper elevation={6} sx={{ p: '20px' }}>
                <Stack direction='row' spacing={3} alignItems='center' justifyContent='space-between'>
                  <Typography variant='h6'>Create New User</Typography>
                  <IconButton onClick={() => setOpen(!open)}>{open ? <ExpandLess /> : <ExpandMore />}</IconButton>
                </Stack>
                <Collapse in={open} timeout='auto' unmountOnExit>
                    <SignUpForm />
                </Collapse>
              </Paper>
            </Box>
          </>
        )}
      </Stack>
    </Box>
  );
}
