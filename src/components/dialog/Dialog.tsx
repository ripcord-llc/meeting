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

  '& > *:not(:last-child)': {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
}));

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
  const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('md'));

  return (
    <MuiDialog
      open={open}
      onClose={onClose}
      fullWidth
      fullScreen={isMobile}
      disablePortal
      sx={{
        '& .MuiDialog-paper': {
          overflow: 'hidden',
          m: 0,
          transition: (theme) =>
            theme.transitions.create('max-width', {
              easing: theme.transitions.easing.easeInOut,
              duration: theme.transitions.duration.standard,
            }),
        },
      }}
      {...rest}
    >
      <StyledContent>
        <Stack
          direction="row"
          alignItems="center"
          px={{
            xs: 3,
            md: 4,
          }}
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
          px={{
            xs: 3,
            md: 4,
          }}
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
