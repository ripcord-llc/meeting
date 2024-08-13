"use client";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";

import ThemeProvider from "../theme";

export default function ConfigurationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ThemeProvider themeMode="light">{children}</ThemeProvider>
    </LocalizationProvider>
  );
}
