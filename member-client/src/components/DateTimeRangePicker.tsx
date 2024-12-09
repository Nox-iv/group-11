import { Box, Typography } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { Dayjs } from 'dayjs';

interface DateTimeRangePickerProps {
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  onStartDateChange: (date: Dayjs | null) => void;
  onEndDateChange: (date: Dayjs | null) => void;
}

export const DateTimeRangePicker = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: DateTimeRangePickerProps) => {

  const handleStartDateChange = (newDate: Dayjs | null) => {
    onStartDateChange(newDate);
    if (endDate && newDate && endDate < newDate) {
      onEndDateChange(newDate);
    }
  };

  const handleEndDateChange = (newDate: Dayjs | null) => {
    onEndDateChange(newDate);
    if (startDate && newDate && startDate > newDate) {
      onStartDateChange(newDate);
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      <DateTimePicker
        label="Start Date & Time"
        value={startDate}
        onChange={handleStartDateChange}
        maxDate={endDate || undefined}
      />
      <Typography>-</Typography>
      <DateTimePicker
        label="End Date & Time"
        value={endDate}
        onChange={handleEndDateChange}
        minDate={startDate || undefined}
      />
    </Box>
  );
}; 