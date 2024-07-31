export type ColorSchema = 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error' | 'purple' | 'cyan' | 'orange';
declare module '@mui/material/styles' {
    interface Palette {
        purple: Palette['primary'];
        cyan: Palette['primary'];
        orange: Palette['primary'];
    }
    interface PaletteOptions {
        purple?: PaletteOptions['primary'];
        cyan?: PaletteOptions['primary'];
        orange?: PaletteOptions['primary'];
    }
}
declare module '@mui/material/styles/createPalette' {
    interface TypeBackground {
        neutral: string;
    }
    interface SimplePaletteColorOptions {
        lighter: string;
        darker: string;
    }
    interface PaletteColor {
        lighter: string;
        darker: string;
    }
}
export default function palette(themeMode: 'light' | 'dark'): {
    readonly mode: "light";
    readonly text: {
        readonly primary: string;
        readonly secondary: string;
        readonly disabled: string;
    };
    readonly background: {
        readonly paper: "#FFFFFF";
        readonly default: "#FFFFFF";
        readonly neutral: string;
    };
    readonly action: {
        readonly active: string;
        readonly hover: string;
        readonly selected: string;
        readonly disabled: string;
        readonly disabledBackground: string;
        readonly focus: string;
        readonly hoverOpacity: number;
        readonly disabledOpacity: number;
    };
    readonly common: {
        black: string;
        white: string;
    };
    readonly primary: {
        lighter: string;
        light: string;
        main: string;
        dark: string;
        darker: string;
        contrastText: string;
    };
    readonly secondary: {
        lighter: string;
        light: string;
        main: string;
        dark: string;
        darker: string;
        contrastText: string;
    };
    readonly info: {
        lighter: string;
        light: string;
        main: string;
        dark: string;
        darker: string;
        contrastText: string;
    };
    readonly success: {
        lighter: string;
        light: string;
        main: string;
        dark: string;
        darker: string;
        contrastText: string;
    };
    readonly warning: {
        lighter: string;
        light: string;
        main: string;
        dark: string;
        darker: string;
        contrastText: string;
    };
    readonly error: {
        lighter: string;
        light: string;
        main: string;
        dark: string;
        darker: string;
        contrastText: string;
    };
    readonly purple: {
        lighter: string;
        light: string;
        main: string;
        dark: string;
        darker: string;
        contrastText: string;
    };
    readonly cyan: {
        lighter: string;
        light: string;
        main: string;
        dark: string;
        darker: string;
        contrastText: string;
    };
    readonly orange: {
        name: string;
        lighter: string;
        light: string;
        main: string;
        dark: string;
        darker: string;
        contrastText: string;
    };
    readonly grey: {
        0: string;
        100: string;
        200: string;
        300: string;
        400: string;
        500: string;
        600: string;
        700: string;
        800: string;
        900: string;
    };
    readonly divider: string;
} | {
    readonly mode: "dark";
    readonly text: {
        readonly primary: "#FFFFFF";
        readonly secondary: string;
        readonly disabled: string;
    };
    readonly background: {
        readonly paper: string;
        readonly default: string;
        readonly neutral: string;
    };
    readonly action: {
        readonly active: string;
        readonly hover: string;
        readonly selected: string;
        readonly disabled: string;
        readonly disabledBackground: string;
        readonly focus: string;
        readonly hoverOpacity: number;
        readonly disabledOpacity: number;
    };
    readonly common: {
        black: string;
        white: string;
    };
    readonly primary: {
        lighter: string;
        light: string;
        main: string;
        dark: string;
        darker: string;
        contrastText: string;
    };
    readonly secondary: {
        lighter: string;
        light: string;
        main: string;
        dark: string;
        darker: string;
        contrastText: string;
    };
    readonly info: {
        lighter: string;
        light: string;
        main: string;
        dark: string;
        darker: string;
        contrastText: string;
    };
    readonly success: {
        lighter: string;
        light: string;
        main: string;
        dark: string;
        darker: string;
        contrastText: string;
    };
    readonly warning: {
        lighter: string;
        light: string;
        main: string;
        dark: string;
        darker: string;
        contrastText: string;
    };
    readonly error: {
        lighter: string;
        light: string;
        main: string;
        dark: string;
        darker: string;
        contrastText: string;
    };
    readonly purple: {
        lighter: string;
        light: string;
        main: string;
        dark: string;
        darker: string;
        contrastText: string;
    };
    readonly cyan: {
        lighter: string;
        light: string;
        main: string;
        dark: string;
        darker: string;
        contrastText: string;
    };
    readonly orange: {
        name: string;
        lighter: string;
        light: string;
        main: string;
        dark: string;
        darker: string;
        contrastText: string;
    };
    readonly grey: {
        0: string;
        100: string;
        200: string;
        300: string;
        400: string;
        500: string;
        600: string;
        700: string;
        800: string;
        900: string;
    };
    readonly divider: string;
};
//# sourceMappingURL=palette.d.ts.map