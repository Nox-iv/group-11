import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { verifyEmail } from '../services/userService';
import { Box, Typography, Alert, CircularProgress } from '@mui/material';
import Navigation from '../components/navigation/Navigation';

export default function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');

    if (!code) {
      setStatus('error');
      setMessage('Invalid verification code.');
      return;
    }

    (async () => {
      try {
        const res = await verifyEmail(code);
        if (res?.success) {
          setStatus('success');
          setMessage('Email verified successfully!');
        } else {
          setStatus('error');
          setMessage('Email verification failed.');
        }
      } catch (err: any) {
        setStatus('error');
        setMessage(err.response?.data?.error || 'Email verification failed.');
      }
    })();
  }, [location.search]);

  return (
    <>
      <Navigation />
      <Box
        sx={{
          minHeight: 'calc(100vh - 100px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {status === 'loading' && <CircularProgress />}
        {status !== 'loading' && (
          <Box sx={{ maxWidth: 400, textAlign: 'center', p: 2 }}>
            <Alert severity={status === 'success' ? 'success' : 'error'}>
              {message}
            </Alert>
            {status === 'success' && (
              <Typography
                sx={{ mt: 2, textDecoration: 'underline', cursor: 'pointer' }}
                onClick={() => navigate('/login')}
              >
                Go to Login
              </Typography>
            )}
          </Box>
        )}
      </Box>
    </>
  );
}
