import { useCallback, useEffect, useMemo, useState } from 'react';

import { Box, Typography } from '@mui/material';
import { DateTimePicker, DateTimeValidationError, TimeView } from '@mui/x-date-pickers';

import dayjs, { Dayjs } from 'dayjs';

interface DateTimeRangePickerProps {
  isRenewal?: boolean;
  minimumStartDateTime: Dayjs | null;
  maximumStartDateTime: Dayjs | null;
  maxBorrowingDuration: number;
  branchOpeningHours: Map<number, [number, number][]>
  layout: 'row' | 'column';
  onStartDateChange: (date: Dayjs | null) => void;
  onEndDateChange: (date: Dayjs | null) => void;
  onError: (status: string | null) => void;
}

export const BorrowingDateTimeRangePicker = ({
  isRenewal,
  minimumStartDateTime,
  maximumStartDateTime,
  maxBorrowingDuration,
  branchOpeningHours,
  layout,
  onStartDateChange,
  onEndDateChange,
  onError,
}: DateTimeRangePickerProps) => {

  const [startDate, setStartDate] = useState<Dayjs | null>(minimumStartDateTime);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);

  const [startDateError, setStartDateError] = useState<DateTimeValidationError | null>(null);
  const [endDateError, setEndDateError] = useState<DateTimeValidationError | null>(null);

  useEffect(() => {
    setStartDate(minimumStartDateTime);
    setEndDate(null);
    setStartDateError(null);
    setEndDateError(null);
  }, [branchOpeningHours]);

  const getDateTimeErrorMessage = (error: DateTimeValidationError | null, dateType: string): string | null => {
    if (!error) return null;

    switch (error) {
      case 'invalidDate':
        return 'Invalid date format';
      case 'disablePast':
        return 'You cannot select a date in the past';
      case 'shouldDisableDate':
      case 'shouldDisableMonth':
      case 'shouldDisableYear':
      case 'shouldDisableTime-hours':
      case 'shouldDisableTime-minutes':
      case 'shouldDisableTime-seconds': 
        return 'Please select a time within the branch opening hours';
      case 'minDate':
      case 'minTime':
        return `The ${dateType} date you have selected is before the minimum allowed date`;
      case 'maxDate':
      case 'maxTime':
        return `The ${dateType} date you have selected is after the maximum allowed date`;
      case 'minutesStep':
        return 'Invalid time selection';
      default:
        return 'Invalid date or time selection';
    }
  };

  const startDateErrorMsg = useMemo(() => {
    if(!startDate) {
      return null;
    }

    return getDateTimeErrorMessage(startDateError, 'start');
  }, [startDate, startDateError]);

  const endDateErrorMsg = useMemo(() => {
    if(!endDate) {
      return null;
    }

    return getDateTimeErrorMessage(endDateError, 'end');
  }, [endDate, endDateError]);
  
  const getEnabledDatesInRange = useCallback((startDate: Dayjs, endDate: Dayjs) => {
    const enabledDatesInRange = new Set<Dayjs>();
    for (let currentDate = startDate; currentDate <= endDate; currentDate = currentDate.add(1, 'day')) {
      const dayOfWeek = currentDate.day();
      const openingHours = branchOpeningHours.get(dayOfWeek);
      if (openingHours) {
        enabledDatesInRange.add(currentDate);
      }
    }
    return enabledDatesInRange;
  }, [branchOpeningHours]);

  const isTimeEnabled = useCallback((date: Dayjs, openingHours: Dayjs[][]) => {
    for (const [open, close] of openingHours) {
      if (date >= open && date <= close) {
        return true;
      }
    }
    return false;
  }, []);

  const enabledStartDates = useMemo(() => {
    if(!minimumStartDateTime || !maximumStartDateTime || !branchOpeningHours.size) {
      return undefined;
    }

    return getEnabledDatesInRange(minimumStartDateTime, maximumStartDateTime);
  }, [minimumStartDateTime, maximumStartDateTime, branchOpeningHours, getEnabledDatesInRange]);

  const [minmimumEndDate, maximumEndDate] = useMemo(() => {
    if(!startDate) {
      return [undefined, undefined];
    }

    return [startDate.add(1, 'day'), startDate.add(maxBorrowingDuration, 'day')];
  }, [startDate, maxBorrowingDuration]);

  const enabledEndDates = useMemo(() => {
    if(!minmimumEndDate || !maximumEndDate || !branchOpeningHours.size) {
      return undefined;
    }

    return getEnabledDatesInRange(minmimumEndDate, maximumEndDate);
  }, [minmimumEndDate, maximumEndDate, branchOpeningHours, getEnabledDatesInRange]);


  const shouldDisableStartDate = useCallback((date: Dayjs) => {
    return !!(enabledStartDates && enabledStartDates.has(date));
  }, [enabledStartDates]);

  const startDateOpeningHours = useMemo(() => {
    let startDateOpeningHoursArray;
    if(!startDate || !(startDateOpeningHoursArray = branchOpeningHours.get(startDate.day()))) {
      return undefined;
    }

    return startDateOpeningHoursArray
      .map(([open, close]) => {
        const openTime = dayjs(startDate).hour(Math.floor(open / 100)).minute(open % 100);
        const closeTime = dayjs(startDate).hour(Math.floor(close / 100)).minute(close % 100);
        return [openTime, closeTime];
      });
  }, [startDate, branchOpeningHours]);

  const shouldDisableStartTime = useCallback((date: Dayjs, _: TimeView) => {
    if(!startDateOpeningHours) {
      return true;
    }

    return (!isTimeEnabled(date, startDateOpeningHours));
  }, [startDateOpeningHours, isTimeEnabled]);

  const shouldDisableEndDate = useCallback((date: Dayjs) => {
    return !!(enabledEndDates && enabledEndDates.has(date));
  }, [enabledEndDates]);

  const endDateOpeningHours = useMemo(() => {
    let endDateOpeningHoursArray;
    if(!endDate || !(endDateOpeningHoursArray = branchOpeningHours.get(endDate.day()))) {
      return undefined;
    }

    return endDateOpeningHoursArray
      .map(([open, close]) => {
        const openTime = dayjs(endDate).hour(Math.floor(open / 100)).minute(open % 100);
        const closeTime = dayjs(endDate).hour(Math.floor(close / 100)).minute(close % 100);
        return [openTime, closeTime];
      });
  }, [endDate, branchOpeningHours]);

  const shouldDisableEndTime = useCallback((date: Dayjs, _: TimeView) => {
    if(!endDateOpeningHours) {
      return true;
    }

    return !isTimeEnabled(date, endDateOpeningHours);
  }, [endDateOpeningHours, isTimeEnabled]);

  const handleStartDateChange = useCallback((date: Dayjs | null) => {
    setStartDate(date);
    onStartDateChange(date);

    setEndDate(null);
    onEndDateChange(null);
  }, [onStartDateChange, onEndDateChange]);

  const handleEndDateChange = useCallback((date: Dayjs | null) => {
    setEndDate(date);
    onEndDateChange(date);
  }, [onEndDateChange]);

  const handleStartDateError = useCallback((error: DateTimeValidationError | null) => {
    setStartDateError(error);
    onError(error);
  }, [setStartDateError, onError]);

  const handleEndDateError = useCallback((error: DateTimeValidationError | null) => {
    setEndDateError(error);
    onError(error);
  }, [setEndDateError, onError]);


  return (
    <Box sx={{width: '100%'}}>
      <Box sx={{ height: '100px', display: 'flex', flexDirection: layout === 'row' ? 'row' : 'column', gap: 2, alignItems: 'center', width: '100%' }}>
        <DateTimePicker
          label="Start Date & Time"
          value={startDate}
          onChange={handleStartDateChange}
          onError={handleStartDateError}
          minDate={isRenewal ? undefined : minimumStartDateTime ?? undefined}
          maxDate={isRenewal ? undefined : maximumStartDateTime ?? undefined}
          disablePast={isRenewal ? false : true}
          shouldDisableDate={isRenewal ? undefined : shouldDisableStartDate}
          shouldDisableTime={isRenewal ? undefined : shouldDisableStartTime}
          disabled={!minimumStartDateTime || !maximumStartDateTime || !branchOpeningHours.size || isRenewal}
        />
        <DateTimePicker
          label="End Date & Time"
          value={endDate}
          onChange={handleEndDateChange}
          onError={handleEndDateError}
          minDate={minmimumEndDate}
          maxDate={maximumEndDate}
          disablePast={true}
          shouldDisableDate={shouldDisableEndDate}
          shouldDisableTime={shouldDisableEndTime}
          disabled={!startDate || !!startDateError || branchOpeningHours.size === 0}
        />
      </Box>
      <Box>
        <Box sx={{display: 'flex', flexDirection: 'column', gap: 1}}>
          {startDateErrorMsg && <Typography color="error">Start Date Error: {startDateErrorMsg}</Typography>}
          {endDateErrorMsg && <Typography color="error">End Date Error: {endDateErrorMsg}</Typography>}
        </Box>
      </Box>
    </Box>
  );
}; 