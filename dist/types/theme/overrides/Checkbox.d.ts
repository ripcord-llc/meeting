/// <reference types="react" />
import { Theme } from '@mui/material/styles';
import { CheckboxProps } from '@mui/material';
export default function Checkbox(theme: Theme): {
    MuiCheckbox: {
        defaultProps: {
            icon: import("react").JSX.Element;
            checkedIcon: import("react").JSX.Element;
            indeterminateIcon: import("react").JSX.Element;
        };
        styleOverrides: {
            root: ({ ownerState }: {
                ownerState: CheckboxProps;
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
//# sourceMappingURL=Checkbox.d.ts.map