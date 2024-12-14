import { Fragment, useState } from 'react';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import SearchIcon from '@mui/icons-material/Search';

import { useQuery } from '@tanstack/react-query';

import { searchMedia } from '../api/getMedia';
import { MediaSearchRequest } from '../api/types/mediaSearchRequest';
import { MediaSearchFilters } from '../api/types/mediaSearchFilters';
import { MediaDocument } from '../api/types/mediaSearchResult';

import { debounce } from '../utils/debounce';

export default function Search({
    label = 'Search',
    width = '100%',
    hidden = false,
    pageSize = 10,
    page = 0,
    filters = undefined,
    availableAtLocation = undefined,
    searchTerm = undefined,
    onSearch = undefined,
}: {
    label?: string;
    width?: string;
    hidden?: boolean;
    pageSize?: number;
    page?: number;
    filters?: MediaSearchFilters;
    availableAtLocation?: number;
    searchTerm?: string;
    onSearch?: (searchTerm: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [realTimeSearchTerm, setRealTimeSearchTerm] = useState(searchTerm ?? '');
  const [searchRequest, setSearchRequest] = useState<MediaSearchRequest>({
    searchTerm: searchTerm ?? '',
    page,
    pageSize,
    availableAtLocation,
    filters
  });

  const {data, isLoading} = useQuery({
    queryKey: ['media', 
      searchRequest.searchTerm, 
      searchRequest.page, 
      searchRequest.pageSize, 
      searchRequest.availableAtLocation, 
      searchRequest.filters?.type,
      searchRequest.filters?.genres,
    ],
    queryFn: () => searchMedia(searchRequest),
  })

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const debouncedSearch = debounce((value: string) => {
    setSearchRequest({ ...searchRequest, searchTerm: value });
  }, 50);

  return (
    <Autocomplete
      sx={{ width: width, display: hidden ? 'none' : 'block' }}
      open={open}
      onOpen={handleOpen}
      onClose={handleClose}
      freeSolo={true}
      isOptionEqualToValue={(option, value) => option === value}
      noOptionsText="No results"
      options={open && data ? data.data.map((result : MediaDocument) => result.title) : []}
      loading={isLoading}
      value={searchRequest.searchTerm}
      onInputChange={(_, value) => {
        if (value) {
          debouncedSearch(value);
          setRealTimeSearchTerm(value);
        }
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          onSearch?.(realTimeSearchTerm);
        }
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          slotProps={{
            input: {
              ...params.InputProps,
              startAdornment: (
                <Fragment>
                  <SearchIcon />
                </Fragment>
              ),
              endAdornment: (
                <Fragment>
                  {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </Fragment>
              ),
            },
          }}
        />
      )}
    />
  );
}