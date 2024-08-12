import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  Stack,
  Button,
  DialogActions,
  Avatar,
  TextField,
} from "@mui/material";

import ConfigurationProvider from "./ConfigurationProvider";

export interface BookingWidgetProps {
  open: boolean;
  onClose: () => void;
  routingId: string;
  productId?: string;
}

export default function BookingWidget({ open, onClose }: BookingWidgetProps) {
  return (
    <ConfigurationProvider>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="sm"
        disablePortal
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          gap={1}
          pt={3}
          px={3}
        >
          <Avatar
            src="https://cdn.trendhunterstatic.com/thumbs/510/oatmilk-cheese-square.jpeg?auto=webp"
            sx={{
              width: 48,
              height: 48,
            }}
          />
          <Typography variant="subtitle1">Cheese Corp</Typography>
        </Stack>
        <Stack gap={3} p={3}>
          <TextField label="Email" fullWidth />
          <TextField label="Url" fullWidth />
          <Button variant="outlined" fullWidth color="inherit">
            Next
          </Button>
        </Stack>
      </Dialog>
    </ConfigurationProvider>
  );
}
