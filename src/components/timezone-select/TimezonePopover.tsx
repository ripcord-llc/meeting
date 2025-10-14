import { memo, useState } from 'react';
import {
  Box,
  TextField,
  Popover,
  Stack,
  Typography,
  ListSubheader,
  InputAdornment,
  PopoverProps,
  MenuList,
  MenuItem,
  IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import {
  TIMEZONE_LABELS,
  TIMEZONE_OFFSETS,
  TIMEZONE_GROUPS_FOR_LISTING,
  fuzzySearchByLabel,
  TIMEZONE_LABEL_TO_VALUE,
} from './constants';

export default function TimezonePopover(
  props: Omit<PopoverProps, 'onChange' | 'value'> & {
    onChange: (value: string) => void;
  }
) {
  const { onChange, anchorEl, ...rest } = props;

  return (
    <Popover
      anchorEl={anchorEl}
      {...rest}
      slotProps={{
        paper: {
          variant: 'outlined',
          sx: {
            minWidth: anchorEl instanceof HTMLElement ? anchorEl.clientWidth : undefined,
          },
          ...rest.slotProps?.paper,
        },
        ...rest.slotProps,
      }}
      TransitionProps={{
        unmountOnExit: true,
        ...rest.TransitionProps,
      }}
    >
      <TimezoneSelector onChange={onChange} />
    </Popover>
  );
}

function TimezoneSelector({ onChange }: { onChange: (value: string) => void }) {
  const [search, setSearch] = useState('');

  return (
    <Stack>
      <TimezoneSearch value={search} onChange={setSearch} onClear={() => setSearch('')} />
      <TimezoneMenu search={search} onChange={onChange} />
    </Stack>
  );
}

const TimezoneMenu = memo(
  ({ search, onChange }: { search: string; onChange: (value: string) => void }) => (
    <MenuList
      sx={{
        flex: 1,
        maxHeight: 400,
        overflow: 'auto',
      }}
    >
      {!!search &&
        fuzzySearchByLabel(search).map((timezoneLabel) => {
          const timezone = TIMEZONE_LABEL_TO_VALUE[timezoneLabel];

          return <TimezoneMenuItem key={timezone} timezone={timezone} onClick={onChange} />;
        })}
      {!search &&
        TIMEZONE_GROUPS_FOR_LISTING.map((item) => {
          if (item.type === 'timezone') {
            return <TimezoneMenuItem key={item.value} timezone={item.value} onClick={onChange} />;
          }

          return <ListSubheader key={item.label}>{item.label}</ListSubheader>;
        })}
    </MenuList>
  )
);

function TimezoneSearch({
  value,
  onChange,
  onClear,
}: {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}) {
  const hasValue = !!value;

  return (
    <Box
      sx={{
        p: 1,
        flexShrink: 0,
      }}
    >
      <TextField
        value={value}
        onChange={(e) => onChange(e.target.value)}
        fullWidth
        placeholder="Search..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
          endAdornment: hasValue ? (
            <InputAdornment position="end">
              <IconButton color="error" sx={{ flexShrink: 0 }} onClick={onClear}>
                <DeleteOutlineIcon />
              </IconButton>
            </InputAdornment>
          ) : null,
        }}
      />
    </Box>
  );
}

function TimezoneMenuItem({
  timezone,
  onClick,
}: {
  timezone: string;
  onClick: (value: string) => void;
}) {
  return (
    <MenuItem
      onClick={() => onClick(timezone)}
      sx={{
        borderRadius: 1,
      }}
    >
      <Typography variant="subtitle1" flex={1}>
        ({TIMEZONE_OFFSETS[timezone]}) {TIMEZONE_LABELS[timezone]}
      </Typography>
    </MenuItem>
  );
}
