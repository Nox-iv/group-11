import { useEffect, useState } from 'react';

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

interface Branch {
  branchId: number;
  name: string;
  openingHours: Map<number, [number, number][]>;
  borrowingConfig: {
    maxRenewals: number;
    maxBorrowingPeriod: number;
  };
}

const branch: Branch = {
    branchId: 1,
    name: "Sheffield Central",
    openingHours: new Map<number, [number, number][]>([
      [0, [[900, 1700]]],
      [1, [[900, 1700]]],
      [2, [[900, 1700]]],
      [3, [[900, 1700]]],
      [4, [[900, 1700]]],
      [5, [[900, 1700]]],
      [6, [[900, 1700]]]
    ]),
    borrowingConfig: {
      maxRenewals: 1,
      maxBorrowingPeriod: 14
    }
}

const branch2 = {
  branchId: 2,
  name: "Sheffield South",
  openingHours: new Map<number, [number, number][]>([
    [0, [[1800, 2000]]],
    [1, [[1800, 2000]]],
    [2, [[1800, 2000]]],
    [3, [[1800, 2000]]],
    [4, [[1800, 2000]]],
    [5, [[1800, 2000]]],
    [6, [[1800, 2000]]]
  ]),
  borrowingConfig: {
    maxRenewals: 1,
    maxBorrowingPeriod: 7
  }
}

const branches = [branch, branch2]

export default function BookingModal({disabled}: {disabled: boolean}) {
  const isSmallScreen = useMediaQuery('(max-width: 475px)');

  const [bookingOpen, setBookingOpen] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);

  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);

  const [branch, setBranch] = useState<Branch>(branches[0]);
  const [hasBorrowingData, setHasBorrowingData] = useState(false);

  const handleBookingOpen = () => setBookingOpen(true);
  const handleBookingClose = () => setBookingOpen(false);

  const handleSubmit = () => {
    setBranch(branches[0]);
    setStartDate(null);
    setEndDate(null);

    setBookingOpen(false);

    handleConfirmationOpen();
  }

  const handleConfirmationOpen = () => setConfirmationOpen(true);
  const handleConfirmationClose = () => setConfirmationOpen(false);

  useEffect(() => {
    setStartDate(null);
    setEndDate(null);
  }, [branch]);

  useEffect(() => {
    if (startDate && endDate) {
      setHasBorrowingData(true);
    }
  }, [startDate, endDate]);

  return (
    <div>
      <Button disabled={disabled} onClick={handleBookingOpen}>Book</Button>
      <Modal
      open={bookingOpen}
      onClose={handleBookingClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{ 
        maxWidth: isSmallScreen ? '95%' : '600px', 
        margin: '0 auto',
      }}
      >
        <Box sx={{...style, flexDirection: 'row', justifyContent: 'flex-start'}}>
          <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: 3}}>
            <Box sx={{marginBottom: 2,}}>
                <Typography variant="h5">Borrow Item</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row'}}>
              <Typography variant="h6">Title: </Typography>
              <Typography marginTop={0.7} marginLeft={1} variant="body1">{mediaItem.title}</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
              <Typography variant="h6">Branch: </Typography>
              <Select
                value={branch?.branchId}
                onChange={(event) => setBranch(branches.find(b => b.branchId === event.target.value) || branches[0])}
                sx={{ marginLeft: 1, marginTop: 2, marginBottom: 2, minWidth: 200 }}
                size="small"
              >
                {branches.map((branch) => (
                  <MenuItem value={branch.branchId}>{branch.name}</MenuItem>
                ))}
              </Select>
            </Box>
            <Box sx={{marginBottom: 2, marginTop: isSmallScreen ? 2 : 0, width: '100%'}}>
              <BorrowingDateTimeRangePicker
                maxBorrowingDuration={branch.borrowingConfig.maxBorrowingPeriod}
                layout={isSmallScreen ? 'column' : 'row'}
                branchOpeningHours={branch.openingHours}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
              />
            </Box>
            <Box sx={{width: '100%', height: '50px', textAlign: 'center', marginTop: isSmallScreen ? 5 : 0}}>
              <Button sx={{width: '100%', height: '100%'}} variant="contained" color="primary" disabled={!hasBorrowingData} onClick={handleSubmit}>Confirm</Button>
            </Box>
          </Box>
        </Box>
      </Modal>

      <Modal
      open={confirmationOpen}
      onClose={handleConfirmationClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{ 
        maxWidth: isSmallScreen ? '95%' : '600px', 
        margin: '0 auto',
      }}
      >
        <Box sx={style}>
          <Typography variant="h5">Confirmation</Typography>
          <Typography variant="body1">Your booking has been confirmed.</Typography>
          <Button onClick={handleConfirmationClose}>Close</Button>
        </Box>
      </Modal>
    </div>
  );
}