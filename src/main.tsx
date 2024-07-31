import { CssBaseline, Typography } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({});

export default function Main() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Typography variant="h1" sx={{}}>
        Hello, world!
      </Typography>
    </ThemeProvider>
  );
}
