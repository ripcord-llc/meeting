import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import MuiTextField, { TextFieldProps } from "@mui/material/TextField";

import { useFormContext, Controller } from "react-hook-form";

// ----------------------------------------------------------------------

type Props = Omit<TextFieldProps, "label"> & {
  name: string;
  label: string;
  description?: string;
};

export default function TextField({
  name,
  helperText,
  label,
  description,
  ...other
}: Props) {
  const { control } = useFormContext();

  return (
    <Stack gap={1}>
      <Box>
        <Typography variant="subtitle2">{label}</Typography>
        {description && <Typography variant="body2">{description}</Typography>}
      </Box>
      <Controller
        name={name}
        control={control}
        render={({ field: { ref, ...field }, fieldState: { error } }) => (
          <MuiTextField
            {...field}
            fullWidth
            value={
              typeof field.value === "number" && field.value === 0
                ? ""
                : field.value
            }
            error={!!error}
            helperText={error ? error?.message : helperText}
            inputProps={{
              ref,
            }}
            {...other}
          />
        )}
      />
    </Stack>
  );
}
