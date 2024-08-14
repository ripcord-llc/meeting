import { Box, Stack, Typography } from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";

export default function ErrorScreen({
  error = "Something went wrong while loading. Please contact the administrator for this page for help.",
}: {
  error?: string;
}) {
  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      gap={2}
      p={4}
      sx={{
        height: 600,
        maxHeight: "100%",
      }}
    >
      <Box
        sx={{
          width: 112,
          height: 112,
          bgcolor: "error.main",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ErrorIcon
          sx={{
            width: 72,
            height: 72,
            color: "common.white",
          }}
        />
      </Box>
      <Typography variant="h4">An error occured</Typography>
      <Typography variant="body1" color="text.secondary" textAlign="center">
        {error}
      </Typography>
    </Stack>
  );
}
