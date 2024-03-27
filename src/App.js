import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import UploadPage from './pages/UploadPage';

const theme = createTheme({
  typography: {
    fontFamily: 'Inter, sans-serif',
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <UploadPage />
    </ThemeProvider>
  );
};

export default App;