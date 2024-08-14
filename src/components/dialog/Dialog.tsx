import MuiDialog, { DialogProps } from "@mui/material/Dialog";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import CloseIcon from "@mui/icons-material/Close";
import PoweredByRipcordIcon from "../icons/PoweredByRipcordIcon";

export default function Dialog({
  open,
  onClose,
  children,
  slots,
  ...rest
}: {
  open: boolean;
  onClose: () => void;
  slots?: {
    headerLeft?: React.ReactNode;
    footerLeft?: React.ReactNode;
  };
  children?: React.ReactNode;
} & DialogProps) {
  return (
    <MuiDialog
      open={open}
      onClose={onClose}
      fullWidth
      disablePortal
      sx={{
        "& .MuiDialog-paper": {
          transition: (theme) =>
            theme.transitions.create("max-width", {
              easing: theme.transitions.easing.easeInOut,
              duration: theme.transitions.duration.standard,
            }),
        },
      }}
      {...rest}
    >
      <Stack divider={<Divider flexItem />}>
        <Stack direction="row" alignItems="center" px={4} py={2}>
          {slots?.headerLeft}
          <IconButton
            size="small"
            onClick={onClose}
            sx={{ marginLeft: "auto" }}
          >
            <CloseIcon sx={{ width: 20, height: 20 }} />
          </IconButton>
        </Stack>
        <Box
          sx={{
            height: 1,
            flex: "1 0",
          }}
        >
          {children}
        </Box>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
          px={4}
          py={2}
        >
          {slots?.footerLeft}
          <PoweredByRipcordIcon
            component="a"
            href="https://www.ripcord.io/"
            target="_blank"
            rel="noopener noreferrer"
            sx={(theme) => ({
              ml: "auto",
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
    </MuiDialog>
  );
}
