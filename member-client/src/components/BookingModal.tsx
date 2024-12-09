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
          <Box sx={{textAlign: 'left'}}>
            <Typography variant="h4">Booking Confirmation</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row'}}>
              <Typography variant="h6">Media Item: </Typography>
              <Typography marginTop={0.6} marginLeft={1} variant="body1">{mediaItem.title}</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
              <Typography variant="h6">Branch: </Typography>
              <Typography marginTop={0.5} marginLeft={1} variant="body1">{branch.name}</Typography>
            </Box>
          </Box>
          <Box>
            <DateTimeRangePicker
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
            />
          </Box>
          <Box sx={{width: '100%', height: '50px', textAlign: 'center'}}>
            <Button sx={{width: '100%', height: '100%', marginTop: 1}} variant="contained" color="primary" onClick={handleClose}>Confirm</Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}