/// <reference types="react" />
import { Theme } from '@mui/material/styles';
import { AlertProps } from '@mui/material';
export default function Alert(theme: Theme): {
    MuiAlert: {
        defaultProps: {
            iconMapping: {
                info: import("react").JSX.Element;
                success: import("react").JSX.Element;
                warning: import("react").JSX.Element;
                error: import("react").JSX.Element;
            };
        };
        styleOverrides: {
            root: ({ ownerState }: {
                ownerState: AlertProps;
            }) => {
                color?: string | undefined;
                border?: string | undefined;
                '& .MuiAlert-icon'?: {
                    color: string;
                } | undefined;
                backgroundColor?: string | undefined;
            }[];
            icon: {
                opacity: number;
            };
        };
    };
    MuiAlertTitle: {
        styleOverrides: {
            root: {
                marginBottom: string;
            };
        };
    };
};
//# sourceMappingURL=Alert.d.ts.map