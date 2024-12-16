import { useCallback, useEffect, useMemo, useState } from 'react';

import { Box, Typography } from '@mui/material';
import { DateTimePicker, DateTimeValidationError } from '@mui/x-date-pickers';

import dayjs, { Dayjs } from 'dayjs';

interface DateTimeRangePickerProps {
  maxBorrowingDuration: number;
  branchOpeningHours: Map<number, [number, number][]>
  layout: 'row' | 'column';
  onStartDateChange: (date: Dayjs | null) => void;
  onEndDateChange: (date: Dayjs | null) => void;
}

export const BorrowingDateTimeRangePicker = ({
  maxBorrowingDuration,
  branchOpeningHours,
  layout,
  onStartDateChange,
  onEndDateChange,
}: DateTimeRangePickerProps) => {
  const getDayJsFromBranchOpeningHours = useCallback((date: Dayjs, openingHour: number) => {
    return dayjs(date)
      .set('hours', Math.floor(openingHour / 100))
      .set('minutes', openingHour % 100)
      .set('seconds', 0)
      .set('milliseconds', 0)
  }, []);

  const [minStartDateNoTime] = useState<Dayjs>(() => {
    const currentDate = dayjs()
    if (branchOpeningHours.size > 0) {
      const branchOpeningHoursForDayX = branchOpeningHours.get(currentDate.day())!
      const closingTime = branchOpeningHoursForDayX[branchOpeningHoursForDayX.length - 1][1]
      const closingDateTime = getDayJsFromBranchOpeningHours(currentDate, closingTime)
      return closingDateTime.isBefore(currentDate) ? closingDateTime.add(1, 'day') : closingDateTime
    }

    return currentDate
  });

  const [maxStartDateNoTime] = useState<Dayjs>(dayjs(minStartDateNoTime).add(1, 'day'));
  const [startDate, setStartDate] = useState<Dayjs | null>(null);


  const [minEndDateNoTime, setMinEndDateNoTime] = useState<Dayjs | null>(startDate?.add(1, 'day') ?? null);
  const [maxEndDateNoTime, setMaxEndDateNoTime] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);

  const [startDateError, setStartDateError] = useState<DateTimeValidationError | null>(null);
  const [endDateError, setEndDateError] = useState<DateTimeValidationError | null>(null);

  const [startDateMinTime, startDateMaxTime] = useMemo(() => {
    if (startDate && branchOpeningHours.size > 0) {
      const branchOpeningHoursForDayX = branchOpeningHours.get(startDate.day())!
      const openingTime = branchOpeningHoursForDayX[0][0]
      const minimumValidStartTime = getDayJsFromBranchOpeningHours(startDate, openingTime)

      const closingTime = branchOpeningHoursForDayX[branchOpeningHoursForDayX.length - 1][1]
      const maximumValidStartTime = getDayJsFromBranchOpeningHours(startDate, closingTime)

      return [minimumValidStartTime, maximumValidStartTime]
    }
    return [undefined, undefined]
  }, [startDate, branchOpeningHours, getDayJsFromBranchOpeningHours]);

  const [endDateMinTime, endDateMaxTime] = useMemo(() => {
    if (endDate && branchOpeningHours.size > 0) {
      const branchOpeningHoursForDayX = branchOpeningHours.get(endDate.day())!
      const openingTime = branchOpeningHoursForDayX[0][0]
      const minimumValidEndTime = getDayJsFromBranchOpeningHours(endDate, openingTime)

      const closingTime = branchOpeningHoursForDayX[branchOpeningHoursForDayX.length - 1][1]
      const maximumValidEndTime = getDayJsFromBranchOpeningHours(endDate, closingTime)
      return [minimumValidEndTime, maximumValidEndTime]
    }
    return [undefined, undefined]
  }, [endDate, branchOpeningHours, getDayJsFromBranchOpeningHours]);

  const validateTimeSelectionIsWithinBranchOpeningHours = useCallback((date: Dayjs, validTimes: [number, number][], errorCb: (error: DateTimeValidationError) => void) => {
    for (const [open, close] of validTimes) {
      const openDate = getDayJsFromBranchOpeningHours(date, open)
      const closeDate = getDayJsFromBranchOpeningHours(date, close)

      if (date >= openDate && date <= closeDate) {
        errorCb(null)
        return
      }
    }

    errorCb('minTime')
  }, [getDayJsFromBranchOpeningHours]);

  const startDateErrorMsg = useMemo(() => {
    switch (startDateError) {
      case 'minDate':
        return 'Please select a start date on the current day or the next day.';
      case 'maxDate':
        return 'Please select a start date within the next 24 hours.';
      case 'minTime':
        return 'Please select a pick-up time within the branch opening hours.';
      case 'maxTime':
        return 'Please select a pick-up time within the branch opening hours.';
      default:
        return null;
    }
  }, [startDateError]);

  const endDateErrorMsg = useMemo(() => {
    switch (endDateError) {
      case 'minDate':
        return 'Please select an end date at least 1 day after the start date.';
      case 'maxDate':
        return 'Please select an end date within the maximum borrowing duration.';
      case 'minTime':
        return 'Please select a drop-off time within the branch opening hours.';
      case 'maxTime':
        return 'Please select a drop-off time within the branch opening hours.';
      default:
        return null;
    }
  }, [endDateError]);

  useEffect(() => {
    if (!startDateError) {
      console.log(startDate)
      onStartDateChange(startDate);
    } else {
      onStartDateChange(null);
    }
  }, [startDateError, startDate, onStartDateChange]);

  useEffect(() => {
    if (!endDateError) {
      onEndDateChange(endDate);
    } else {
      onEndDateChange(null);
    }
  }, [endDateError, endDate, onEndDateChange]);

  const handleStartDateChange = (newDate: Dayjs | null) => {
    if (startDate && newDate) {
      const newDateNoTime = dayjs(newDate).set('hours', 0).set('minutes', 0).set('seconds', 0).set('milliseconds', 0)
      const startDateNoTime = dayjs(startDate).set('hours', 0).set('minutes', 0).set('seconds', 0).set('milliseconds', 0)

      if (newDateNoTime != startDateNoTime) {
        setMinEndDateNoTime(newDateNoTime.add(1, 'day'));
        setMaxEndDateNoTime(newDateNoTime.add(maxBorrowingDuration, 'day'));
        handleEndDateChange(null);
      } 
    } else if (startDate === null && newDate) {
      setMinEndDateNoTime(newDate.add(1, 'day'));
      setMaxEndDateNoTime(newDate.add(maxBorrowingDuration, 'day'));
      handleEndDateChange(null);
    } else if (startDate && newDate === null) {
      setMinEndDateNoTime(null);
      setMaxEndDateNoTime(null);
      handleEndDateChange(null);
    }

    setStartDate(newDate);
    if (newDate) {
      validateTimeSelectionIsWithinBranchOpeningHours(newDate, branchOpeningHours.get(newDate.day())!, setStartDateError)
    }
  };

  const handleEndDateChange = (newDate: Dayjs | null) => {
    setEndDate(newDate);

    if (newDate) {
      validateTimeSelectionIsWithinBranchOpeningHours(newDate, branchOpeningHours.get(newDate.day())!, setEndDateError)
    }
  };

  return (
    <Box sx={{width: '100%'}}>
      <Box sx={{ height: '100px', display: 'flex', flexDirection: layout === 'row' ? 'row' : 'column', gap: 2, alignItems: 'center', width: '100%' }}>
        <DateTimePicker
          label="Start Date & Time"
          sx={{width: '100%', color: (startDateError !== null) ? 'error.main' : 'inherit'}}
          value={startDate}
          onChange={handleStartDateChange}
          onError={(newError) => setStartDateError(newError)}
          minDate={minStartDateNoTime}
          minTime={startDateMinTime}
          maxDate={maxStartDateNoTime}
          maxTime={startDateMaxTime}
          disablePast={true}
          disabled={branchOpeningHours.size === 0}
        />
        <DateTimePicker
          label="End Date & Time"
          sx={{width: '100%', color: (endDateError !== null) ? 'error.main' : 'inherit'}}
          value={endDate}
          onChange={handleEndDateChange}
          onError={(newError) => setEndDateError(newError)}
          minDate={minEndDateNoTime ?? undefined}
          minTime={endDateMinTime}
          maxDate={maxEndDateNoTime ?? undefined}
          maxTime={endDateMaxTime}
          disablePast={true}
          disabled={startDate === null || startDateError !== null || branchOpeningHours.size === 0}
        />
      </Box>
      <Box>
        <Typography variant="caption" color="error">{startDateErrorMsg}</Typography>
        <Typography variant="caption" color="error">{endDateErrorMsg}</Typography>
      </Box>
    </Box>
  );
}; 