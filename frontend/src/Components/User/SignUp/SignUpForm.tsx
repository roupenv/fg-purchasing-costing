import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import React, { useState } from 'react';

const token = localStorage.getItem('token');
const authorization = 'Bearer ' + token


export default function SignUpForm() {
  const [role, setRole] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMismatchError, setPasswordMismatchError] = useState(false);

  const handleSignUp = async (e: any) => {
    e.preventDefault();

    if (password === confirmPassword) {
      setPasswordMismatchError(false);

      const login = {
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
        role: role,
      };

      const sendCredentials = async (payload: object) => {
        const sendData = await fetch('/api/login/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': authorization
          },
          body: JSON.stringify(payload),
        });
        const response = await sendData.json();
        console.log(sendData);
        if (!sendData.ok) {
          if (response.message === 'User Already Exists') {
            setEmailError(true);
            return;
          }
          throw new Error(response.message);
        }
        return response;
      };

      await sendCredentials(login);
    } else {
      setPasswordMismatchError(true);
    }
  };

  return (
    <Box component='form' onSubmit={handleSignUp} autoComplete='off'>
      <Stack direction='column' spacing={3}>
        <TextField
          id='role-sign-up'
          label='Role'
          variant='outlined'
          select
          required
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <MenuItem value='ADMIN'>Admin</MenuItem>
          <MenuItem value='USER'>User</MenuItem>
        </TextField>
        <TextField
          id='firstName-sign-up'
          label='First Name'
          variant='outlined'
          type='text'
          required
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <TextField
          id='lastName-sign-up'
          label='Last Name'
          variant='outlined'
          type='text'
          required
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <TextField
          id='email-login'
          label='Email'
          variant='outlined'
          type='email'
          required
          error={emailError}
          helperText={emailError ? 'User Already Exists' : null}
          value={email}
          onChange={(e) => {
            setEmailError(false);
            setEmail(e.target.value);
          }}
        />
        <TextField
          id='password-login'
          type='password'
          label='Password'
          variant='outlined'
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          id='re-enter-password-login'
          type='password'
          label='Re-enter Password'
          variant='outlined'
          error={passwordMismatchError}
          helperText={passwordMismatchError ? 'Password Does Not Match' : null}
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Button variant='contained' type='submit' color='secondary'>
          Sign Up
        </Button>
      </Stack>
    </Box>
  );
}
