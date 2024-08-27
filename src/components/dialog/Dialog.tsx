import { Dialog as MuiDialog, DialogProps, Box, IconButton, Stack } from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';

import styled from '@mui/material/styles/styled';

import PoweredByRipcordIcon from '../icons/PoweredByRipcordIcon';

const StyledContent = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateRows: '48px 1fr 48px',
  overflow: 'hidden',

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
  return (
    <MuiDialog
      open={open}
      onClose={onClose}
      fullWidth
      disablePortal
      sx={{
        '& .MuiDialog-paper': {
          overflow: 'hidden',
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
        <Stack direction="row" alignItems="center" px={4}>
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
        <Stack direction="row" alignItems="center" px={4}>
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
