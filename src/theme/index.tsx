import { CssBaseline, useMediaQuery } from "@mui/material";
import {
  createTheme,
  ThemeProvider as MUIThemeProvider,
} from "@mui/material/styles";
//
import palette from "./palette";
import typography from "./typography";
import shadows from "./shadows";
import componentsOverride from "./overrides";
import customShadows from "./customShadows";
import GlobalStyles from "./globalStyles";

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function ThemeProvider({
  children,
  themeMode,
}: Props & { themeMode?: "light" | "dark" }) {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  if (!themeMode) {
    themeMode = prefersDarkMode ? "dark" : "light";
  }

  const meetingPalette = palette(themeMode);

  const theme = createTheme({
    palette: {
      ...meetingPalette,
      primary: meetingPalette.secondary,
    },
    typography,
    shape: { borderRadius: 8 },
    direction: "ltr",
    shadows: shadows(themeMode),
    customShadows: customShadows(themeMode),
  });

  theme.components = componentsOverride(theme);

  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles />
      {children}
    </MUIThemeProvider>
  );
}
