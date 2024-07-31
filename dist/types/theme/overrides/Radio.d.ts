/// <reference types="react" />
import { Theme } from '@mui/material/styles';
import { RadioProps } from '@mui/material';
declare module '@mui/material/Radio' {
    interface RadioPropsColorOverrides {
        purple: true;
        cyan: true;
        orange: true;
    }
}
export default function Radio(theme: Theme): {
    MuiRadio: {
        defaultProps: {
            icon: import("react").JSX.Element;
            checkedIcon: import("react").JSX.Element;
        };
        styleOverrides: {
            root: ({ ownerState }: {
                ownerState: RadioProps;
            }) => {
                '& svg'?: {
                    width: number;
                    height: number;
                } | undefined;
                padding: string;
            };
        };
    };
};
//# sourceMappingURL=Radio.d.ts.map