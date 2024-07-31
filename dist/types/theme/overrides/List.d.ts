import { Theme } from '@mui/material/styles';
export default function List(theme: Theme): {
    MuiListItemIcon: {
        styleOverrides: {
            root: {
                color: string;
                minWidth: string;
                marginRight: string;
            };
        };
    };
    MuiListItemAvatar: {
        styleOverrides: {
            root: {
                minWidth: string;
                marginRight: string;
            };
        };
    };
    MuiListItemText: {
        styleOverrides: {
            root: {
                marginTop: number;
                marginBottom: number;
            };
            multiline: {
                marginTop: number;
                marginBottom: number;
            };
        };
    };
};
//# sourceMappingURL=List.d.ts.map