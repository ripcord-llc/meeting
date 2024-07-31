/// <reference types="react" />
import { Theme } from '@mui/material/styles';
export default function Rating(theme: Theme): {
    MuiRating: {
        defaultProps: {
            emptyIcon: import("react").JSX.Element;
            icon: import("react").JSX.Element;
        };
        styleOverrides: {
            root: {
                '&.Mui-disabled': {
                    opacity: number;
                };
            };
            iconEmpty: {
                color: string;
            };
            sizeSmall: {
                '& svg': {
                    width: number;
                    height: number;
                };
            };
            sizeLarge: {
                '& svg': {
                    width: number;
                    height: number;
                };
            };
        };
    };
};
//# sourceMappingURL=Rating.d.ts.map