import { Theme } from '@mui/material/styles';
import { ButtonProps } from '@mui/material';
declare module '@mui/material/Button' {
    interface ButtonPropsColorOverrides {
        purple: true;
        cyan: true;
        orange: true;
    }
    interface ButtonPropsVariantOverrides {
        soft: true;
    }
}
export default function Button(theme: Theme): {
    MuiButton: {
        defaultProps: {
            disableElevation: boolean;
        };
        styleOverrides: {
            root: ({ ownerState }: {
                ownerState: ButtonProps;
            }) => ({
                color?: string | undefined;
                backgroundColor?: string | undefined;
                '&:hover'?: {
                    boxShadow: string;
                    backgroundColor?: undefined;
                } | {
                    backgroundColor: string;
                    boxShadow?: undefined;
                } | undefined;
            } | {
                color?: string | undefined;
                backgroundColor?: string | undefined;
                '&:hover'?: {
                    boxShadow: string;
                    backgroundColor: string;
                    borderColor?: undefined;
                } | {
                    borderColor: string;
                    backgroundColor: string;
                    boxShadow?: undefined;
                } | {
                    backgroundColor: string;
                    boxShadow?: undefined;
                    borderColor?: undefined;
                } | undefined;
                borderColor?: string | undefined;
            } | {
                '&.Mui-disabled': {
                    backgroundColor?: string | undefined;
                };
            } | {
                padding?: string | undefined;
                height?: number | undefined;
                fontSize?: number | undefined;
            })[];
        };
    };
};
//# sourceMappingURL=Button.d.ts.map