import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import React, { useState } from 'react';
import useAuth from '../../Hooks/useAuth';
import LandingPageCard from '../../Layouts/LandingPageCard';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const auth = useAuth();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const loginServiceResponse = await auth?.login({ email, password });
    if (loginServiceResponse === 'success') {
      // setEmail('');
      // setPassword('');
    } else {
      setEmail('');
      setPassword('');
      setError(true);
    }
    return;
  };

  return (
    <Box component='form' autoComplete='off' onSubmit={handleSubmit} id='login-form'>
      <LandingPageCard cardTitle='Finished Goods Purchasing' cardSubtitle='Login'>
        <>
          {error ? <Alert severity='error'>Could not find user with email/password combination!</Alert> : null}
          <TextField
            id='email-login'
            label='Email'
            variant='outlined'
            type='email'
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          <Button variant='contained' type='submit' color='secondary'>
            Log In
          </Button>
        </>
      </LandingPageCard>
    </Box>
  );
}
