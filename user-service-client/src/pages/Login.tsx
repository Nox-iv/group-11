import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { AuthContext } from '../context/authContext';
import { loginUser } from '../services/userService';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  useTheme
} from '@mui/material';
import Navigation from '../components/navigation/Navigation';

export default function Login() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, login } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>('');
  const [formErrors, setFormErrors] = useState<string[]>([]);

  // If user is already logged in, redirect to homepage
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  // Validate form inputs
  const validateForm = () => {
    const errors: string[] = [];
    if (!email.trim()) errors.push('Email is required.');
    if (!password.trim()) errors.push('Password is required.');
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    const errors = validateForm();
    setFormErrors(errors);

    if (errors.length > 0) {
      return; // Stop submission if validation fails
    }

    try {
      const result = await loginUser({ email, password });
      console.log(result);
      if (result?.userId) {
        login({
          userId: result.userId,
          token: result.token,
          role: result.role,
        });
        navigate('/');
      } else if (result?.success === true && result?.message === "Account not verified. Check your email for the verification link.") {
        setError(result?.message);
      } else {
        setError('Login failed: invalid response from server.');
      }
    } catch (err: any) {
        const responseData = err?.response?.data;
        if (responseData?.error === 'Request failed with status code 401') {
            setError('Email or password is incorrect.');
        } else {
            setError(responseData?.error || 'Login failed due to an error.');
        }
    }
  };

  if (user) {
    return null;
  }

  return (
    <>
      <Navigation />
      <Box
        component="main"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 'calc(100vh - 64px)',
          backgroundColor: theme.palette.background.default,
          py: 4,
          px: 2,
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            width: '100%',
            maxWidth: 400,
            backgroundColor: theme.palette.mode === 'dark' ? '#333' : '#f5f5f5',
            color: theme.palette.text.primary,
            p: 3,
            borderRadius: 2,
            boxShadow: 3,
          }}
          aria-label="Login form"
        >
          <Typography variant="h5" mb={2} component="h1">
            Login
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {formErrors.length > 0 && (
            <Box sx={{ mb: 2 }}>
              {formErrors.map((err, idx) => (
                <Alert key={idx} severity="warning" sx={{ mb: 1 }}>
                  {err}
                </Alert>
              ))}
            </Box>
          )}

          <TextField
            label="Email"
            aria-label="Email address"
            variant="outlined"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Password"
            aria-label="Password"
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            required
          />

          <Box sx={{ textAlign: 'right', mt: 1 }}>
            <Typography
              variant="body2"
              component="button"
              onClick={() => alert('Forgot password logic here!')}
              sx={{
                background: 'none',
                border: 'none',
                p: 0,
                textDecoration: 'underline',
                color: theme.palette.primary.main,
                cursor: 'pointer',
              }}
            >
              Forgot password?
            </Typography>
          </Box>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            aria-label="Login button"
          >
            LOGIN
          </Button>
        </Box>
      </Box>
    </>
  );
}
