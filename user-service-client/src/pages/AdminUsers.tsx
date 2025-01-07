import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/authContext';
import { useNavigate } from 'react-router';
import {
  getAllUsersPaginated,
  adminUpdateUser
} from '../services/userService';
import {
  Box,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Autocomplete
} from '@mui/material';
import Navigation from '../components/navigation/Navigation';

function formatDateLocal(dob: string | Date) {
    const date = typeof dob === 'string' ? new Date(dob) : dob;
    return date.toLocaleDateString('en-CA'); 
  }

export default function AdminUsers() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [limit] = useState(5);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'admin') {
      navigate('/');
      return;
    }
    loadUsers();
  }, [user, page]);

  async function loadUsers() {
    setError('');
    try {
      if (!user) {
        setError('User is not authenticated.');
        return;
      }
      const data = await getAllUsersPaginated(user.userId, limit, page * limit);
      setUsers(data || []);
    } catch (err: any) {
      setError('Failed to load users.');
    }
  }

  const handleEditClick = (usr: any) => {
    setSelectedUser({ ...usr });
  };

  const handleDialogClose = () => {
    setSelectedUser(null);
  };

  const handleDialogSave = async () => {
    if (!selectedUser) return;
    setError('');

    try {
      if (!user) {
        setError('User is not authenticated.');
        return;
      }
      await adminUpdateUser({
        adminId: user.userId,
        targetUserId: selectedUser.user_id,
        fname: selectedUser.first_name,
        sname: selectedUser.last_name,
        phone: selectedUser.phone,
        branchLocationID: selectedUser.branch_location_id,
        dob: selectedUser.date_of_birth,
        role: selectedUser.user_role,
        email: selectedUser.email,
      });
      handleDialogClose();
      loadUsers();
    } catch (err: any) {
      setError('Failed to update user.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedUser) return;
    const { name, value } = e.target;
    setSelectedUser((prev: any) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <Navigation />
      <Box sx={{ p: 2, minHeight: 'calc(100vh - 100px)' }}>
        <Typography variant="h4" mb={2}>
          Manage Users (Admin)
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {users.map((usr) => (
          <Box
            key={usr.user_id}
            sx={{
              p: 2,
              mb: 1,
              backgroundColor: '#333',
              borderRadius: 1,
              color: '#fff',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Box>
              <Typography variant="subtitle1">
                {usr.first_name} {usr.last_name}
              </Typography>
              <Typography variant="body2">{usr.email}</Typography>
            </Box>
            <Button
              variant="contained"
              onClick={() => handleEditClick(usr)}
            >
              Edit
            </Button>
          </Box>
        ))}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button
            variant="contained"
            onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
            disabled={page === 0}
          >
            Previous
          </Button>
          <Button
            variant="contained"
            onClick={() => setPage((prev) => prev + 1)}
            disabled={users.length < limit}
          >
            Next
          </Button>
        </Box>

        <Dialog
        fullWidth
        maxWidth="md"
        open={!!selectedUser}
        onClose={handleDialogClose}
        >
        <DialogTitle>Edit User</DialogTitle>
        {selectedUser && (
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
                label="First Name"
                name="first_name"
                value={selectedUser.first_name}
                onChange={handleChange}
            />
            <TextField
                label="Last Name"
                name="last_name"
                value={selectedUser.last_name}
                onChange={handleChange}
            />
            <TextField
                label="Email"
                name="email"
                value={selectedUser.email}
                onChange={handleChange}
            />
            <TextField
                label="Phone"
                name="phone"
                value={selectedUser.phone}
                onChange={handleChange}
            />
            {/* Dropdown for branch location */}
            <Autocomplete
                options={[
                { label: 'Sheffield', value: 1 },
                { label: 'Newport', value: 2 },
                { label: 'London', value: 3 },
                { label: 'Leeds', value: 4 },
                ]}
                getOptionLabel={(option) => option.label}
                value={
                selectedUser.branch_location_id
                    ? [{ label: 'Sheffield', value: 1 }, { label: 'Newport', value: 2 }, { label: 'London', value: 3 }, { label: 'Leeds', value: 4 }].find(
                        (o) => o.value === selectedUser.branch_location_id
                    ) || null
                    : null
                }
                onChange={(_, newValue) => {
                setSelectedUser((prev: any) => ({
                    ...prev,
                    branch_location_id: newValue ? newValue.value : 0,
                }));
                }}
                renderInput={(params) => (
                <TextField
                    {...params}
                    label="Branch Location"
                    name="branch_location_id"
                />
                )}
            />
            <TextField
                label="Date of Birth"
                name="date_of_birth"
                type="date"
                value={
                    selectedUser.date_of_birth
                      ? formatDateLocal(selectedUser.date_of_birth)
                      : ''
                }
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
            />
            <TextField
                label="Role"
                name="user_role"
                value={selectedUser.user_role}
                onChange={handleChange}
            />
            </DialogContent>
        )}
        <DialogActions>
            <Button onClick={handleDialogClose}>Cancel</Button>
            <Button variant="contained" onClick={handleDialogSave}>
            Save
            </Button>
        </DialogActions>
        </Dialog>
      </Box>
    </>
  );
}
