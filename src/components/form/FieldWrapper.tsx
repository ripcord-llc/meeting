import { Stack, Typography } from "@mui/material";

export default function FieldWrapper({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <Stack gap={0.5}>
      <Typography variant="subtitle2">{label}</Typography>
      {description && (
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      )}
      {children}
    </Stack>
  );
}
