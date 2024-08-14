import { Box, CircularProgress } from "@mui/material";

export default function LoadingScreen() {
  return (
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
  );
}
