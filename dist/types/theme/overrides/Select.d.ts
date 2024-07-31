import { Theme } from '@mui/material/styles';
import { InputSelectIcon } from './CustomIcons';
export default function Select(theme: Theme): {
    MuiSelect: {
        defaultProps: {
            IconComponent: typeof InputSelectIcon;
        };
    };
};
//# sourceMappingURL=Select.d.ts.map