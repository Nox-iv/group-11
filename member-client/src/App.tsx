import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Box } from '@mui/material';
import Navigation from './components/Navigation';
import { createTheme, ThemeProvider } from '@mui/material/styles';

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

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Box>
        <Navigation />
      </Box>
    </ThemeProvider>
  )
}

export default App
