import { Fragment, useCallback, useState } from 'react';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import SearchIcon from '@mui/icons-material/Search';

import { useQuery } from '@tanstack/react-query';

import { searchMedia } from '../../api/media-search/searchMedia';
import { MediaSearchRequest } from '../../api/media-search/types/mediaSearchRequest';
import { MediaSearchFilters } from '../../api/media-search/types/mediaSearchFilters';
import { MediaDocument } from '../../api/media-search/types/mediaSearchResult';

import { debounce } from '../../utils/debounce';

export default function Search({
    label = 'Search',
    width = '100%',
    hidden = false,
    pageSize = 10,
    page = 0,
    filters = undefined,
    availableAtLocation = undefined,
    searchTerm = undefined,
    rangeFrom = undefined,
    rangeTo = undefined,
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
    rangeFrom?: Date;
    rangeTo?: Date;
    onSearch?: (searchTerm: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [searchRequest, setSearchRequest] = useState<MediaSearchRequest>({
    searchTerm: searchTerm ?? '',
    page,
    pageSize,
    availableAtLocation,
    filters,
    range: {
      releaseDate: {
        from: rangeFrom ?? undefined,
        to: rangeTo ?? undefined
      }
    }
  });

  const {data, isLoading} = useQuery({
    queryKey: ['media', 
      searchRequest.searchTerm, 
      searchRequest.page, 
      searchRequest.pageSize, 
      searchRequest.availableAtLocation, 
      searchRequest.filters?.type,
      searchRequest.filters?.genres,
      searchRequest.range?.releaseDate?.from,
      searchRequest.range?.releaseDate?.to
    ],
    queryFn: () => searchMedia(searchRequest),
  })

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearchRequest(prev => ({ ...prev, searchTerm: value }));
    }, 100),
    [setSearchRequest]
  );

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
        }
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          console.log('onKeyDown', searchRequest.searchTerm);
          onSearch?.(searchRequest.searchTerm);
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