import { Theme } from '@mui/material/styles';
export default function Accordion(theme: Theme): {
    MuiAccordion: {
        styleOverrides: {
            root: {
                backgroundColor: string;
                '&.Mui-expanded': {
                    boxShadow: string;
                    borderRadius: number;
                    backgroundColor: string;
                };
                '&.Mui-disabled': {
                    backgroundColor: string;
                };
            };
        };
    };
    MuiAccordionSummary: {
        styleOverrides: {
            root: {
                paddingLeft: string;
                paddingRight: string;
                '&.Mui-disabled': {
                    opacity: number;
                    color: string;
                    '& .MuiTypography-root': {
                        color: string;
                    };
                };
            };
            expandIconWrapper: {
                color: string;
            };
        };
    };
};
//# sourceMappingURL=Accordion.d.ts.map