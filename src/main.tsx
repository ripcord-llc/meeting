import {
  CssBaseline,
  Typography,
  Dialog,
  DialogTitle,
  Stack,
  Button,
} from "@mui/material";

import ThemeProvider from "./theme";

export default function Main() {
  return (
    <ThemeProvider themeMode="light">
      <Dialog open>
        <DialogTitle>
          <Typography variant="h6">Hello, world!</Typography>
        </DialogTitle>
        <Stack spacing={3} p={3}>
          <Typography variant="body1">
            This is a dialog box rendered using Material-UI.
          </Typography>
          <Typography variant="body1">
            It is styled using the default theme.
          </Typography>
        </Stack>
      </Dialog>
    </ThemeProvider>
  );
}
