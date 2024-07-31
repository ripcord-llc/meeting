import { Theme } from '@mui/material/styles';
export default function Input(theme: Theme): {
    MuiInputBase: {
        styleOverrides: {
            root: {
                '&.Mui-disabled': {
                    '& svg': {
                        color: string;
                    };
                };
            };
            input: {
                '&::placeholder': {
                    opacity: number;
                    color: string;
                };
            };
        };
    };
    MuiInput: {
        styleOverrides: {
            underline: {
                '&:before': {
                    borderBottomColor: string;
                };
                '&:after': {
                    borderBottomColor: string;
                };
            };
        };
    };
    MuiTextField: {
        styleOverrides: {
            root: {
                '& .MuiInputLabel-root.Mui-focused': {
                    color: string;
                };
            };
        };
    };
    MuiFilledInput: {
        styleOverrides: {
            root: {
                borderRadius: number;
                backgroundColor: string;
                '&:hover': {
                    backgroundColor: string;
                };
                '&.Mui-focused': {
                    backgroundColor: string;
                };
                '&.Mui-disabled': {
                    backgroundColor: string;
                };
            };
            underline: {
                '&:before, :after': {
                    display: string;
                };
            };
        };
    };
    MuiOutlinedInput: {
        styleOverrides: {
            root: {
                '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: string;
                };
                '&.Mui-focused': {
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderWidth: number;
                        borderColor: string;
                    };
                };
                '&.Mui-disabled': {
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: string;
                    };
                };
            };
        };
    };
};
//# sourceMappingURL=Input.d.ts.map