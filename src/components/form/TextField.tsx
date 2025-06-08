import { useCallback } from 'react';
import MuiTextField, { TextFieldProps } from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

import { useFormContext, Controller } from 'react-hook-form';

// ----------------------------------------------------------------------

type Props = Omit<TextFieldProps, 'label'> & {
  name: string;
  label?: string;
  description?: string;
};

export default function TextField({ name, helperText, label, description, ...other }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { ref, ...field }, fieldState: { error } }) => (
        <MuiTextField
          {...field}
          fullWidth
          value={typeof field.value === 'number' && field.value === 0 ? '' : field.value}
          error={!!error}
          helperText={error ? error?.message : helperText}
          inputProps={{
            ref,
          }}
          {...other}
        />
      )}
    />
  );
}

export const removeProtocol = (url: string) => url.replace(/^https?:\/\//, '');

const getSelectedRangeAsString = (): string => window.getSelection()?.toString() || '';

export function UrlTextField({ name, helperText, InputProps, inputProps, ...other }: Props) {
  const { control, setValue, getValues } = useFormContext();

  const handlePaste = useCallback(
    (event: React.ClipboardEvent) => {
      // Strips urls of their protocol before pasting. Useful since most people will copy the urls from their browser
      const currentValue = getValues(name);
      const selectedText = getSelectedRangeAsString();

      // Should only paste if either the field is empty or the selected text is the same as the current value
      if (currentValue && selectedText !== currentValue) return;

      const paste = event.clipboardData.getData('text');

      if (paste) {
        setValue(name, removeProtocol(paste), {
          shouldValidate: true,
        });

        event.preventDefault();
      }
    },
    [name, getValues, setValue]
  );

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { ref, ...field }, fieldState: { error } }) => (
        <TextField
          {...field}
          fullWidth
          value={typeof field.value === 'number' && field.value === 0 ? '' : field.value}
          error={!!error}
          helperText={error ? error?.message : helperText}
          inputProps={{
            ref,
            ...inputProps,
          }}
          onPaste={handlePaste}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ mr: 0 }}>
                https://
              </InputAdornment>
            ),
            ...InputProps,
          }}
          {...other}
        />
      )}
    />
  );
}
