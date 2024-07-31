import { Theme } from '@mui/material/styles';
export default function Card(theme: Theme): {
    MuiCard: {
        styleOverrides: {
            root: {
                position: string;
                boxShadow: string;
                borderRadius: number;
                zIndex: number;
            };
        };
    };
    MuiCardHeader: {
        defaultProps: {
            titleTypographyProps: {
                variant: string;
            };
            subheaderTypographyProps: {
                variant: string;
                marginTop: string;
            };
        };
        styleOverrides: {
            root: {
                padding: string;
            };
        };
    };
    MuiCardContent: {
        styleOverrides: {
            root: {
                padding: string;
            };
        };
    };
};
//# sourceMappingURL=Card.d.ts.map