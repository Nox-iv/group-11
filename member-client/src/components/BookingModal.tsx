import { useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { MenuItem } from '@mui/material';
import Select from '@mui/material/Select';
import { useMediaQuery } from '@mui/material';

import { Dayjs } from 'dayjs';

import { BorrowingDateTimeRangePicker } from './BorrowingDateTimeRangePicker';

const style = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 4,
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%',
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
    branchId: 1,
    name: "Sheffield Central",
    openingHours: [
      {
        day: 0,
        openTime: 900,
        closeTime: 1700
      }
    ],
    borrowingConfig: {
      maxRenewals: 1,
      maxBorrowingPeriod: 14
    }
}

const branches = [branch]

export default function BookingModal({disabled}: {disabled: boolean}) {
  const isSmallScreen = useMediaQuery('(max-width: 475px)');

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
        sx={{ 
          maxWidth: isSmallScreen ? '95%' : '600px', 
          margin: '0 auto',
        }}
      >
        <Box sx={{...style, flexDirection: 'row', justifyContent: 'flex-start'}}>
          <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: 3}}>
            <Typography variant="h5" sx={{marginBottom: 1,}} >Borrow Item</Typography>
            <Box sx={{ display: 'flex', marginBottom: 1, flexDirection: 'row'}}>
              <Typography variant="h6">Title: </Typography>
              <Typography marginTop={0.7} marginLeft={1} variant="body1">{mediaItem.title}</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
              <Typography variant="h6">Branch: </Typography>
              <Select
                value={branch.name}
                sx={{ marginLeft: 1, marginTop: 2, marginBottom: 2, minWidth: 200 }}
                size="small"
              >
                {branches.map((branch) => (
                  <MenuItem value={branch.name}>{branch.name}</MenuItem>
                ))}
              </Select>
            </Box>
            <Box sx={{marginBottom: 2, marginTop: isSmallScreen ? 2 : 0, width: '100%'}}>
              <BorrowingDateTimeRangePicker
                maxBorrowingDuration={14}
                layout={isSmallScreen ? 'column' : 'row'}
                branchOpeningHours={
                  new Map<number, [number, number][]>([
                    [0, [[900, 1700]]],
                  [1, [[900, 1700]]],
                  [2, [[900, 1700]]],
                  [3, [[900, 1700]]],
                  [4, [[900, 1700]]],
                  [5, [[900, 1700]]],
                  [6, [[900, 1700]]]
                ])}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
              />
            </Box>
            <Box sx={{width: '100%', height: '50px', textAlign: 'center', marginTop: isSmallScreen ? 5 : 0}}>
              <Button sx={{width: '100%', height: '100%'}} variant="contained" color="primary" onClick={handleClose}>Confirm</Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}