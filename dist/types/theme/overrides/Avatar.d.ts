import { Theme } from '@mui/material/styles';
export default function Avatar(theme: Theme): {
    MuiAvatar: {
        styleOverrides: {
            colorDefault: {
                color: string;
                backgroundColor: string;
            };
        };
    };
    MuiAvatarGroup: {
        defaultProps: {
            max: number;
        };
        styleOverrides: {
            root: {
                justifyContent: string;
            };
            avatar: {
                fontSize: number;
                fontWeight: import("csstype").Property.FontWeight | undefined;
                '&:first-of-type': {
                    fontSize: number;
                    color: string;
                    backgroundColor: string;
                };
            };
        };
    };
};
//# sourceMappingURL=Avatar.d.ts.map