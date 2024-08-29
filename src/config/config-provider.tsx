import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import ThemeProvider from '../theme';

export default function ConfigurationProvider({ children }: { children: React.ReactNode }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ThemeProvider themeMode="light">{children}</ThemeProvider>
    </LocalizationProvider>
  );
}
