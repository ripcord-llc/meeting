import { Box, CircularProgress } from "@mui/material";

import Dialog from "./Dialog";

export default function LoadingDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
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
