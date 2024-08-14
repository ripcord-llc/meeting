import { forwardRef } from "react";
import {
  Stack,
  Box,
  Divider,
  TextField,
  Typography,
  Button,
} from "@mui/material";
import { DateCalendar } from "@mui/x-date-pickers";

import FieldWrapper from "../form/FieldWrapper";

import { PublicRouting } from "../../api/routing/types";

const FormScreen = forwardRef<HTMLDivElement, { routing: PublicRouting }>(
  ({ routing }, ref) => {
    const { account } = routing;

    return (
      <Stack
        direction="row"
        divider={<Divider flexItem orientation="vertical" />}
        ref={ref}
      >
        <Box p={4} flex={1}>
          <Typography variant="h5">Book a Meeting</Typography>
          <Typography variant="body1" color="text.secondary">
            Schedule a demo with {account.name} now.
          </Typography>
          <Stack gap={2} mt={3}>
            <FieldWrapper label="Email">
              <TextField fullWidth variant="outlined" />
            </FieldWrapper>
            <FieldWrapper label="Company Website">
              <TextField
                fullWidth
                variant="outlined"
                InputProps={{
                  startAdornment: "https://",
                }}
              />
            </FieldWrapper>
            <FieldWrapper label="Full Name">
              <TextField fullWidth variant="outlined" />
            </FieldWrapper>
            <FieldWrapper label="Cell Number">
              <TextField
                fullWidth
                variant="outlined"
                helperText="For meeting reminders"
              />
            </FieldWrapper>
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
    );
  }
);

FormScreen.displayName = "FormScreen";

export default FormScreen;
