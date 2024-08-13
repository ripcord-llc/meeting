"use client";
import {
  Box,
  Typography,
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
import CircularProgress from "@mui/material/CircularProgress";

import ConfigurationProvider from "./config";

import Dialog from "./components/dialog/Dialog";
import LoadingDialog from "./components/dialog/LoadingDialog";

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

function WidgetLoading() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: 600,
        maxHeight: "100%",
      }}
    >
      <CircularProgress color="inherit" />
    </Box>
  );
}

export default function BookingWidget({ open, onClose }: BookingWidgetProps) {
  return (
    <ConfigurationProvider>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        slots={{
          headerLeft: (
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
          ),
        }}
      >
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
            <Button fullWidth variant="outlined" color="inherit" sx={{ mt: 3 }}>
              Continue
            </Button>
          </Box>
          <Stack
            p={4}
            flex={1}
            justifyContent="center"
            sx={{
              position: "relative",
            }}
          >
            <Box sx={{ opacity: 0.7 }}>
              <Typography variant="subtitle2" textAlign="center">
                Select a Date
              </Typography>
              <DateCalendar disablePast disabled />
            </Box>
            <Box
              sx={(theme) => ({
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                padding: 2,
                bgcolor: "common.white",
                borderRadius: 1,
                boxShadow: theme.shadows[4],
              })}
            >
              Please fill out the form to book a meeting with Cheese Corp.
            </Box>
          </Stack>
        </Stack>
      </Dialog>
      {/* <LoadingDialog open={open} onClose={onClose} /> */}
    </ConfigurationProvider>
  );
}
