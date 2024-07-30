import { CssBaseline, Typography } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @import url('https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap')

        h1 {
          font-family: 'Barlow', sans-serif;
        }
      `,
    },
  },
});

export default function Main() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Typography
        variant="h1"
        sx={{
          fontFamily: "Barlow",
        }}
      >
        Hello, world!
      </Typography>
    </ThemeProvider>
  );
}
