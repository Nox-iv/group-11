import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './global.css';

import Home from './pages/Home.tsx'
import MediaSearch from './pages/MediaSearch.tsx'
import Details from './pages/Details.tsx'
import MediaBorrowingRecordListing from './pages/MediaBorrowingRecordListing.tsx'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ffffff',
    },
    secondary: {
      main: '#f50057',
    },
    text: {
      secondary: '#929292',
    },
  },
});

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<MediaSearch />} />
            <Route path="/details/:mediaId" element={<Details />} />
            <Route path="/user/:userId/borrowed" element={<MediaBorrowingRecordListing />} />
            </Routes>
          </BrowserRouter>
        </QueryClientProvider>
      </LocalizationProvider>
    </ThemeProvider>
  </StrictMode>,
)
