import { Theme } from '@mui/material/styles';
import { TabProps } from '@mui/material';
export default function Tabs(theme: Theme): {
    MuiTabs: {
        defaultProps: {
            textColor: string;
            allowScrollButtonsMobile: boolean;
            variant: string;
        };
        styleOverrides: {
            scrollButtons: {
                width: number;
                borderRadius: string;
            };
        };
    };
    MuiTab: {
        defaultProps: {
            disableRipple: boolean;
            iconPosition: string;
        };
        styleOverrides: {
            root: ({ ownerState }: {
                ownerState: TabProps;
            }) => {
                minHeight?: number | undefined;
                padding: number;
                opacity: number;
                minWidth: number;
                fontWeight: import("csstype").Property.FontWeight | undefined;
                '&:not(:last-of-type)': {
                    [x: string]: string | {
                        marginRight: string;
                    };
                    marginRight: string;
                };
                '&:not(.Mui-selected)': {
                    color: string;
                };
            };
        };
    };
};
//# sourceMappingURL=Tabs.d.ts.map