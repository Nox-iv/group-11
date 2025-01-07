import React, { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Autocomplete
} from '@mui/material';
import { registerUser } from '../services/userService';
import { useContext } from 'react';
import { AuthContext } from '../context/authContext';
import Navigation from '../components/navigation/Navigation';

const branchOptions = [
  { label: 'Sheffield', value: 1 },
  { label: 'Newport', value: 2 },
  { label: 'London', value: 3 },
  { label: 'Leeds', value: 4 },
];

export default function Registration() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const [formData, setFormData] = useState({
    fname: '',
    sname: '',
    email: '',
    phone: '',
    branchLocationID: 0,
    dob: '',
    password: '',
  });
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    try {
      await registerUser(formData);
      setSuccess(true);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <>
      <Navigation />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 'calc(100vh - 100px)',
          px: 2,
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            width: '100%',
            maxWidth: 400,
            backgroundColor: '#333',
            color: '#fff',
            p: 3,
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <Typography variant="h5" mb={2} component="h1">
            Register
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Registration successful! Please check your email to verify.
            </Alert>
          )}
          <TextField
            label="First Name"
            name="fname"
            value={formData.fname}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            InputProps={{ sx: { color: '#fff' } }}
          />
          <TextField
            label="Last Name"
            name="sname"
            value={formData.sname}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            InputProps={{ sx: { color: '#fff' } }}
          />
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            type="email"
            fullWidth
            required
            margin="normal"
            InputProps={{ sx: { color: '#fff' } }}
          />
          <TextField
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            InputProps={{ sx: { color: '#fff' } }}
          />

          <Autocomplete
            options={branchOptions}
            getOptionLabel={(option) => option.label}
            value={
              branchOptions.find(opt => opt.value === formData.branchLocationID) || null
            }
            onChange={(_, newValue) => {
              setFormData(prev => ({
                ...prev,
                branchLocationID: newValue ? newValue.value : 0,
              }));
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Branch Location"
                margin="normal"
                required
                InputProps={{
                  ...params.InputProps,
                  sx: { color: '#fff' },
                }}
              />
            )}
            sx={{ mt: 2 }}
          />

          <TextField
            label="Date of Birth"
            name="dob"
            type="date"
            value={formData.dob}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            InputLabelProps={{ shrink: true }}
            InputProps={{ sx: { color: '#fff' } }}
          />
          <TextField
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            type="password"
            fullWidth
            required
            margin="normal"
            InputProps={{ sx: { color: '#fff' } }}
          />
          <Button type="submit" variant="contained" sx={{ mt: 2 }} fullWidth>
            Register
          </Button>
        </Box>
      </Box>
    </>
  );
}
