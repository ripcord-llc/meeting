/// <reference types="react" />
import { Theme } from '@mui/material/styles';
import { ChipProps } from '@mui/material';
declare module '@mui/material/Chip' {
    interface ChipPropsVariantOverrides {
        soft: true;
    }
}
export default function Chip(theme: Theme): {
    MuiChip: {
        defaultProps: {
            deleteIcon: import("react").JSX.Element;
        };
        styleOverrides: {
            root: ({ ownerState }: {
                ownerState: ChipProps;
            }) => ({
                color?: string | undefined;
                backgroundColor?: string | undefined;
                '&:hover'?: {
                    backgroundColor: string;
                } | undefined;
                '& .MuiChip-deleteIcon'?: {
                    color: string;
                    '&:hover': {
                        color: string;
                    };
                } | undefined;
                '& .MuiChip-avatar'?: {
                    color: string;
                    backgroundColor: string;
                } | undefined;
            } | {
                color?: string | undefined;
                backgroundColor?: string | undefined;
                '&:hover'?: {
                    backgroundColor: string;
                } | undefined;
                border?: string | undefined;
                '& .MuiChip-avatar'?: {
                    color: string;
                    backgroundColor: string;
                } | undefined;
            })[];
        };
    };
};
//# sourceMappingURL=Chip.d.ts.map