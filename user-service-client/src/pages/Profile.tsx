import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { AuthContext } from '../context/authContext';
import { getUserDetails, userUpdateSelf } from '../services/userService';
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress
} from '@mui/material';
import Navigation from '../components/navigation/Navigation';

import { toast } from 'react-hot-toast';

const locationMap: Record<number, string> = {
  1: 'Sheffield',
  2: 'Newport',
  3: 'London',
  4: 'Leeds',
};

function formatDOB(dob?: string) {
  if (!dob) return '';
  return new Date(dob).toLocaleDateString('en-GB');
}

export default function Profile() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userData, setUserData] = useState<any>({});

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    (async () => {
      try {
        const details = await getUserDetails(user.userId);
        setUserData(details);
      } catch (err: any) {
        setError('Failed to load user data.');
      } finally {
        setLoading(false);
      }
    })();
  }, [user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!user) return;
    setError('');
    try {
      await userUpdateSelf({
        userId: user.userId,
        fname: userData.first_name,
        sname: userData.last_name,
        phone: userData.phone,
      });
      toast.success('Profile updated successfully!');
    } catch (err: any) {
      toast.error('Failed to update profile.');
      setError('Failed to update profile.');
    }
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <Box
        sx={{
          minHeight: 'calc(100vh - 100px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          p: 2,
        }}
      >
        <Box
          sx={{
            maxWidth: 400,
            width: '100%',
            backgroundColor: '#333',
            color: '#fff',
            p: 3,
            borderRadius: 2,
          }}
        >
          <Typography variant="h5" mb={2}>
            My Profile
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <TextField
            label="Email"
            name="email"
            value={userData.email || ''}
            disabled
            fullWidth
            margin="normal"
            InputProps={{ readOnly: true, sx: { color: '#fff' } }}
          />
          <TextField
            label="Date of Birth"
            name="date_of_birth"
            disabled
            value={formatDOB(userData.date_of_birth)}
            fullWidth
            margin="normal"
            InputProps={{ readOnly: true, sx: { color: '#fff' } }}
          />
          <TextField
            label="Branch Location"
            name="branch_location_id"
            disabled
            value={locationMap[userData.branch_location_id] || ''}
            fullWidth
            margin="normal"
            InputProps={{ readOnly: true, sx: { color: '#fff' } }}
          />

          <TextField
            label="First Name"
            name="first_name"
            value={userData.first_name || ''}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputProps={{ sx: { color: '#fff' } }}
          />
          <TextField
            label="Last Name"
            name="last_name"
            value={userData.last_name || ''}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputProps={{ sx: { color: '#fff' } }}
          />
          <TextField
            label="Phone"
            name="phone"
            value={userData.phone || ''}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputProps={{ sx: { color: '#fff' } }}
          />
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={handleSubmit}
            fullWidth
          >
            Update
          </Button>
        </Box>
      </Box>
    </>
  );
}
