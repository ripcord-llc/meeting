import { useFormContext, Controller } from "react-hook-form";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Radio from "@mui/material/Radio";
import FormLabel from "@mui/material/FormLabel";
import MuiRadioGroup, { RadioGroupProps } from "@mui/material/RadioGroup";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import FormControlLabel from "@mui/material/FormControlLabel";

type Props = RadioGroupProps & {
  name: string;
  options: { label: string; value: any }[];
  label?: string;
  description?: string;
  spacing?: number;
  helperText?: React.ReactNode;
};

export default function RadioGroup({
  row,
  name,
  label,
  description,
  options,
  spacing,
  helperText,
  ...other
}: Props) {
  const { control } = useFormContext();

  const labelledby = label ? `${name}-${label}` : "";

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl component="fieldset">
          <MuiRadioGroup
            {...field}
            aria-labelledby={labelledby}
            row={row}
            {...other}
          >
            {options.map((option) => (
              <FormControlLabel
                key={option.value}
                value={option.value}
                control={<Radio />}
                label={option.label}
                sx={{
                  "&:not(:last-of-type)": {
                    mb: spacing || 0,
                  },
                  ...(row && {
                    mr: 0,
                    "&:not(:last-of-type)": {
                      mr: spacing || 2,
                    },
                  }),
                }}
              />
            ))}
          </MuiRadioGroup>

          {(!!error || helperText) && (
            <FormHelperText error={!!error} sx={{ mx: 0 }}>
              {error ? error?.message : helperText}
            </FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
}
