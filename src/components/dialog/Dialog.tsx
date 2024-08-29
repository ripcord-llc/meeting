import {
  Dialog as MuiDialog,
  DialogProps,
  Box,
  IconButton,
  Stack,
  useMediaQuery,
  Theme,
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';

import styled from '@mui/material/styles/styled';

import PoweredByRipcordIcon from '../icons/PoweredByRipcordIcon';

const StyledContent = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateRows: '48px 1fr 48px',
  overflow: 'hidden',
  height: '100%',
}));

export default function Dialog({
  open,
  onClose,
  children,
  slots,
  enableConfirmedDesign = false,
  ...rest
}: {
  open: boolean;
  onClose: () => void;
  slots?: {
    headerLeft?: React.ReactNode;
    footerLeft?: React.ReactNode;
  };
  children?: React.ReactNode;
  enableConfirmedDesign?: boolean;
} & DialogProps) {
  const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('md'));

  return (
    <MuiDialog
      open={open}
      onClose={onClose}
      fullWidth
      fullScreen={isMobile}
      disablePortal
      sx={(theme) => ({
        '& .MuiDialog-paper': {
          overflow: 'hidden',
          m: 0,
          transition: theme.transitions.create(['max-width', 'background-color'], {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.standard,
          }),
          ...(enableConfirmedDesign && {
            bgcolor:
              theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
          }),
        },
      })}
      {...rest}
    >
      <StyledContent>
        <Stack
          direction="row"
          alignItems="center"
          sx={(theme) => ({
            px: {
              xs: 3,
              md: 4,
            },
            ...(!enableConfirmedDesign && {
              borderBottom: `1px solid ${theme.palette.divider}`,
            }),
          })}
        >
          {slots?.headerLeft}
          <IconButton size="small" onClick={onClose} sx={{ marginLeft: 'auto' }}>
            <CloseIcon sx={{ width: 20, height: 20 }} />
          </IconButton>
        </Stack>
        <Box
          sx={{
            overflow: 'hidden',
          }}
        >
          {children}
        </Box>
        <Stack
          direction="row"
          alignItems="center"
          sx={(theme) => ({
            px: {
              xs: 3,
              md: 4,
            },
            borderTop: `1px solid ${theme.palette.divider}`,
            bgcolor:
              theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
          })}
        >
          {slots?.footerLeft}
          <PoweredByRipcordIcon
            component="a"
            href="https://www.ripcord.io/"
            target="_blank"
            rel="noopener noreferrer"
            sx={(theme) => ({
              ml: 'auto',
              display: 'flex',
              alignItems: 'center',
              fill: theme.palette.text.secondary,
              '& svg': {
                height: 20,
              },
            })}
          />
        </Stack>
      </StyledContent>
    </MuiDialog>
  );
}
