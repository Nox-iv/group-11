import { useCallback, useState } from 'react';

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

interface RenewalProps {
  startDate: Dayjs
  endDate: Dayjs
  branch: Branch
}

interface ResultModalProps {
  isSuccess: boolean;
  open: boolean;
  onClose: () => void;
}

export default function BookingModal(
  {
    label,
    mediaLocationId,
    mediaTitle,
    renewal = null,
    open = false,
    onClose,
    onSubmit
  }: 
  {
    label: string,
    mediaLocationId: number,
    mediaTitle: string,
    renewal?: RenewalProps | null,
    open?: boolean,
    onClose: () => void,
    onSubmit: () => boolean
  }) {
  const isSmallScreen = useMediaQuery('(max-width: 475px)');

  const branchQuery = useQuery({
    queryKey: ['branches', mediaLocationId],
    queryFn: () => getBranchesByLocationId(mediaLocationId),
  });

  const [branch, setBranch] = useState<Branch | undefined>(renewal?.branch ?? undefined)

  const [startDate, setStartDate] = useState<Dayjs | null>(renewal?.endDate ?? null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [dateErrors, setDateErrors] = useState<string | null>(null);

  const [resultModalProps, setResultModalProps] = useState<ResultModalProps>({
    isSuccess: false,
    open: false,
    onClose: () => {}
  });

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

  const handleBookingClose = () => {
    if (renewal == null) {
      setBranch(undefined);
      setStartDate(null);
    }

    setEndDate(null);
    onClose();
  }

  const handleSubmit = () => {
    const result = onSubmit();

    setResultModalProps({
      isSuccess: result,
      open: true,
      onClose: () => {
        setResultModalProps(prev => ({ ...prev, open: false }))
        handleBookingClose();
      }
    });
  }

  const handleBranchChange = (branch: Branch | undefined) => {
    if (branch) {
      setBranch(branch);
      setStartDate(null);
      setEndDate(null);
    }
  }

  return (
    <div>
      <Modal
      open={open && !resultModalProps.open}
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
                <Typography variant="h5">{label} Item</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row'}}>
              <Typography variant="h6">Title: </Typography>
              <Typography marginTop={0.7} marginLeft={1} variant="body1">{mediaTitle}</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
              <Typography variant="h6">Branch: </Typography>
                {renewal === null && (
                  <Select
                    value={branch?.branchId || -1}
                    onChange={(event) => handleBranchChange(branchQuery.data?.find(b => b.branchId === event.target.value))}
                    sx={{ marginLeft: 1, marginTop: 2, marginBottom: 2, minWidth: 200 }}
                    size="small"
                    disabled={branchQuery.isLoading}
                  >
                    <MenuItem value={-1}>Select Branch</MenuItem>
                    {branchQuery.data?.map((branch) => (
                      <MenuItem value={branch.branchId}>{branch.name}</MenuItem>
                    ))}
                  </Select>
                )}
                {renewal !== null && (
                  <Typography marginTop={0.7} marginLeft={1} variant="body1">{renewal.branch.name}</Typography>
                )}
            </Box>
            <Box sx={{marginBottom: 2, marginTop: isSmallScreen ? 2 : 0, width: '100%'}}>
              <BorrowingDateTimeRangePicker
                isRenewal={renewal !== null}
                maxBorrowingDuration={branch?.borrowingConfig.maxBorrowingPeriod || 0}
                layout={isSmallScreen ? 'column' : 'row'}
                branchOpeningHours={branch?.openingHours || new Map()}
                minimumStartDateTime={renewal === null ? getSoonestBranchOpenDate(dayjs()) : renewal.endDate}
                maximumStartDateTime={renewal === null ? getSoonestBranchOpenDate(dayjs().add(1, 'day')) : renewal.endDate}
                onStartDateChange={renewal === null ? setStartDate : () => startDate}
                onEndDateChange={setEndDate}
                onError={setDateErrors}
              />
            </Box>
            <Box sx={{width: '100%', height: '50px', textAlign: 'center', marginTop: isSmallScreen ? 5 : 0}}>
              <Button 
                sx={{width: '100%', height: '100%'}} 
                variant="contained" 
                color="primary" 
                disabled={(!startDate || !endDate || !!dateErrors || !branch)} 
                onClick={handleSubmit}
              >
                Confirm
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>

      <Modal
        open={resultModalProps.open}
        onClose={resultModalProps.onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ 
          maxWidth: isSmallScreen ? '95%' : '600px', 
          margin: '0 auto',
        }}
      >
        <Box sx={style}>
          <Typography variant="h5">{resultModalProps.isSuccess ? 'Success' : 'Error'}</Typography>
          <Typography variant="body1">
            {resultModalProps.isSuccess 
              ? `Your ${renewal !== null ? 'renewal' : 'borrowing'} request has been confirmed.`
              : `Your ${renewal !== null ? 'renewal' : 'borrowing'} request could not be processed. Please try again.`
            }
          </Typography>
          <Button onClick={resultModalProps.onClose}>Close</Button>
        </Box>
      </Modal>
    </div>
  );
}