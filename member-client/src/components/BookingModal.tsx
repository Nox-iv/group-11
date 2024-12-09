import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { DateTimeRangePicker } from './DateTimeRangePicker';
import { Dayjs } from 'dayjs';

const style = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 4,
  spacing: 2,
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '25%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const mediaItem = {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    branch: "Central Library",
}

const branch = {
    name: "Sheffield Central"
}

export default function BookingModal({disabled}: {disabled: boolean}) {
  const [open, setOpen] = useState(false);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  

  return (
    <div>
      <Button disabled={disabled} onClick={handleOpen}>Book</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box sx={{textAlign: 'center'}}>
            <Typography variant="h4">Booking Confirmation</Typography>
            <Typography variant="h6">Media Item: {mediaItem.title}</Typography>
            <Typography variant="h6">Branch: {branch.name}</Typography>
          </Box>
          <Box>
            <DateTimeRangePicker
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
            />
          </Box>
          <Box sx={{width: '50%', textAlign: 'center'}}>
            <Button variant="contained" color="primary" onClick={handleClose}>Confirm</Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}