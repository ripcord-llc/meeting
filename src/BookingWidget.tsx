"use client";
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
  Divider,
  IconButton,
  BoxProps,
} from "@mui/material";
import { DateCalendar } from "@mui/x-date-pickers";
import CloseIcon from "@mui/icons-material/Close";

import ConfigurationProvider from "./config";

import PoweredByRipcordIcon from "./components/PoweredByRipcordIcon";

export interface BookingWidgetProps {
  open: boolean;
  onClose: () => void;
  routingId: string;
  productId?: string;
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Stack gap={0.5}>
      <Typography variant="subtitle2">{label}</Typography>
      {children}
    </Stack>
  );
}

export default function BookingWidget({ open, onClose }: BookingWidgetProps) {
  return (
    <ConfigurationProvider>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="md"
        disablePortal
      >
        <Stack divider={<Divider flexItem />}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            px={4}
            py={1}
          >
            <Stack direction="row" gap={1} alignItems="center">
              <Avatar
                src="https://www.shutterstock.com/image-vector/vector-realistic-illustration-square-piece-260nw-121510897.jpg"
                sx={{
                  width: 32,
                  height: 32,
                }}
              />
              <Typography variant="subtitle2">Cheese Corp</Typography>
            </Stack>
            <IconButton size="small" onClick={onClose}>
              <CloseIcon sx={{ width: 20, height: 20 }} />
            </IconButton>
          </Stack>
          <Stack
            direction="row"
            divider={<Divider flexItem orientation="vertical" />}
          >
            <Box p={4} flex={1}>
              <Typography variant="h5">Book a Meeting</Typography>
              <Typography variant="body1" color="text.secondary">
                Schedule a demo with Cheese Corp now.
              </Typography>
              <Stack gap={2} mt={3}>
                <Field label="Email">
                  <TextField fullWidth variant="outlined" />
                </Field>
                <Field label="Company Website">
                  <TextField
                    fullWidth
                    variant="outlined"
                    InputProps={{
                      startAdornment: "https://",
                    }}
                  />
                </Field>
                <Field label="Full Name">
                  <TextField fullWidth variant="outlined" />
                </Field>
                <Field label="Cell Number">
                  <TextField
                    fullWidth
                    variant="outlined"
                    helperText="For meeting reminders"
                  />
                </Field>
              </Stack>
              <Button
                fullWidth
                variant="outlined"
                color="inherit"
                sx={{ mt: 3 }}
              >
                Continue
              </Button>
            </Box>
            <Box p={4} flex={1}>
              <Typography variant="subtitle2" textAlign="center">
                Select a Date
              </Typography>
              <DateCalendar disablePast disabled />
            </Box>
          </Stack>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="flex-end"
            px={4}
            py={2}
          >
            <PoweredByRipcordIcon
              component="a"
              href="https://www.ripcord.io/"
              target="_blank"
              rel="noopener noreferrer"
              sx={(theme) => ({
                display: "flex",
                alignItems: "center",
                fill: theme.palette.text.secondary,
                "& svg": {
                  height: 20,
                },
              })}
            />
          </Stack>
        </Stack>
      </Dialog>
    </ConfigurationProvider>
  );
}
