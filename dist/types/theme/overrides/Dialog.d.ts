import { Theme } from '@mui/material/styles';
export default function Dialog(theme: Theme): {
    MuiDialog: {
        styleOverrides: {
            paper: {
                boxShadow: string;
                '&.MuiPaper-rounded': {
                    borderRadius: number;
                };
                '&.MuiDialog-paperFullScreen': {
                    borderRadius: number;
                };
                '&.MuiDialog-paper .MuiDialogActions-root': {
                    padding: string;
                };
                '@media (max-width: 600px)': {
                    margin: string;
                };
                '@media (max-width: 663.95px)': {
                    '&.MuiDialog-paperWidthSm.MuiDialog-paperScrollBody': {
                        maxWidth: string;
                    };
                };
            };
            paperFullWidth: {
                width: string;
            };
        };
    };
    MuiDialogTitle: {
        styleOverrides: {
            root: {
                padding: string;
            };
        };
    };
    MuiDialogContent: {
        styleOverrides: {
            root: {
                padding: string;
            };
            dividers: {
                borderTop: number;
                borderBottomStyle: string;
                paddingBottom: string;
            };
        };
    };
    MuiDialogActions: {
        styleOverrides: {
            root: {
                '& > :not(:first-of-type)': {
                    marginLeft: string;
                };
            };
        };
    };
};
//# sourceMappingURL=Dialog.d.ts.map