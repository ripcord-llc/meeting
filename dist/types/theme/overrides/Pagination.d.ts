import { Theme } from '@mui/material/styles';
import { PaginationProps } from '@mui/material';
declare module '@mui/material/Pagination' {
    interface PaginationPropsVariantOverrides {
        soft: true;
    }
    interface PaginationPropsColorOverrides {
        info: true;
        success: true;
        warning: true;
        error: true;
    }
}
export default function Pagination(theme: Theme): {
    MuiPagination: {
        defaultProps: {
            color: string;
        };
        styleOverrides: {
            root: ({ ownerState }: {
                ownerState: PaginationProps;
            }) => ({
                '& .MuiPaginationItem-root'?: {
                    '&.Mui-selected': {
                        color: string;
                        backgroundColor: string;
                        '&:hover': {
                            backgroundColor: string;
                        };
                    };
                } | undefined;
            } | {
                '& .MuiPaginationItem-root': {
                    '&.Mui-selected': {
                        fontWeight: import("csstype").Property.FontWeight | undefined;
                    };
                    borderColor?: string | undefined;
                };
            })[];
        };
    };
};
//# sourceMappingURL=Pagination.d.ts.map