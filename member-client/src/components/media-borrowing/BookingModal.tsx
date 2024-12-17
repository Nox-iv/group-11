import { useCallback, useEffect, useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { MenuItem } from '@mui/material';
import Select from '@mui/material/Select';
import { useMediaQuery } from '@mui/material';

import { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

import { BorrowingDateTimeRangePicker } from './BorrowingDateTimeRangePicker';

import { getBranchesByLocationId } from '../../api/media-borrowing/getBranch';
import { Branch } from '../../api/media-borrowing/types/Branch';

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

export default function BookingModal(
  {
    disabled, 
    label,
    mediaLocationId,
    mediaTitle,
  }: 
  {
    disabled: boolean, 
    label: string,
    mediaLocationId: number,
    mediaTitle: string,
  }) {
  const isSmallScreen = useMediaQuery('(max-width: 475px)');

  const branchQuery = useQuery({
    queryKey: ['branches', mediaLocationId],
    queryFn: () => getBranchesByLocationId(mediaLocationId),
  });

  const [bookingOpen, setBookingOpen] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);

  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);

  const [branch, setBranch] = useState<Branch | undefined>(undefined);
  const [dateErrors, setDateErrors] = useState<string | null>(null);
  const [hasBorrowingData, setHasBorrowingData] = useState(false);

  const getSoonestBranchOpenDate = useCallback((date: Dayjs) => {
      let currentDate = date;
      let daysChecked = 0;
      
      while (daysChecked < 7) {
        const dayOfWeek = currentDate.day();
        const openingHours = branch?.openingHours.get(dayOfWeek);
    
        if (openingHours && openingHours.length > 0) {
          const closingTime = openingHours[openingHours.length - 1][1];
          const closingDateTime = dayjs(
            `${currentDate.format('YYYY-MM-DD')} ${closingTime}`
          );
    
          if (currentDate.isBefore(closingDateTime)) {
            return currentDate;
          }
        }
    
        currentDate = currentDate.add(1, 'day').startOf('day');
        daysChecked++;
      }
    
      return null;
    }, [branch?.openingHours]);

  const handleBookingOpen = () => setBookingOpen(true);
  const handleBookingClose = () => {
    setBranch(undefined);
    setStartDate(null);
    setEndDate(null);

    setBookingOpen(false);
  }

  const handleSubmit = () => {
    handleBookingClose();
    console.log(startDate);
    console.log(endDate);

    handleConfirmationOpen();
  }

  const handleConfirmationOpen = () => setConfirmationOpen(true);
  const handleConfirmationClose = () => setConfirmationOpen(false);

  useEffect(() => {
    setStartDate(null);
    setEndDate(null);
  }, [branch]);

  useEffect(() => {
    if (startDate !== null && endDate !== null && !dateErrors && branch) {
      setHasBorrowingData(true);
    } else {
      setHasBorrowingData(false);
    }
  }, [startDate, endDate, dateErrors, branch]);

  return (
    <div>
      <Button disabled={disabled} onClick={handleBookingOpen}>{label}</Button>
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
              <Typography marginTop={0.7} marginLeft={1} variant="body1">{mediaTitle}</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
              <Typography variant="h6">Branch: </Typography>
              <Select
                value={branch?.branchId || -1}
                onChange={(event) => setBranch(branchQuery.data?.find(b => b.branchId === event.target.value) || undefined)}
                sx={{ marginLeft: 1, marginTop: 2, marginBottom: 2, minWidth: 200 }}
                size="small"
                disabled={branchQuery.isLoading}
              >
                <MenuItem value={-1}>Select Branch</MenuItem>
                {branchQuery.data?.map((branch) => (
                  <MenuItem value={branch.branchId}>{branch.name}</MenuItem>
                ))}
              </Select>
            </Box>
            <Box sx={{marginBottom: 2, marginTop: isSmallScreen ? 2 : 0, width: '100%'}}>
              <BorrowingDateTimeRangePicker
                maxBorrowingDuration={branch?.borrowingConfig.maxBorrowingPeriod || 0}
                layout={isSmallScreen ? 'column' : 'row'}
                branchOpeningHours={branch?.openingHours || new Map()}
                minimumStartDateTime={
                  getSoonestBranchOpenDate(dayjs())
                }
                maximumStartDateTime={
                  getSoonestBranchOpenDate(dayjs().add(1, 'day'))
                }
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
                onError={setDateErrors}
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
          <Typography variant="body1">Your {label} request has been confirmed.</Typography>
          <Button onClick={handleConfirmationClose}>Close</Button>
        </Box>
      </Modal>
    </div>
  );
}