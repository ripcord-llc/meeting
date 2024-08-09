import {
  CssBaseline,
  Typography,
  Dialog,
  DialogTitle,
  Stack,
  Button,
  DialogActions,
} from "@mui/material";

import ThemeProvider from "./theme";

export interface BookingWidgetProps {
  open: boolean;
  onClose: () => void;
  routingId: string;
  productId?: string;
}

export default function BookingWidget({ open, onClose }: BookingWidgetProps) {
  return (
    <ThemeProvider themeMode="light">
      <Dialog open={open} fullWidth maxWidth="sm" disablePortal>
        <DialogTitle>Hello, world!</DialogTitle>
        <DialogActions>
          <Button variant="contained" onClick={onClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}
