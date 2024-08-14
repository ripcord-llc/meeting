"use client";
import { useEffect, useState } from "react";
import {
  Box,
  Fade,
  Stack,
  Button,
  Avatar,
  Divider,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { DateCalendar } from "@mui/x-date-pickers";

import Dialog from "./components/dialog/Dialog";

import ConfigurationProvider from "./config";

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

function BookingWidget({ open, onClose }: BookingWidgetProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  });

  if (loading) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm">
        <Box
          sx={{
            height: 600,
            maxHeight: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress color="inherit" />
        </Box>
      </Dialog>
    );
  }

  return (
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
      <Fade in appear timeout={750}>
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
      </Fade>
    </Dialog>
  );
}

export default function Main(props: BookingWidgetProps) {
  return (
    <ConfigurationProvider>
      <BookingWidget {...props} />
    </ConfigurationProvider>
  );
}
