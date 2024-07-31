/// <reference types="react" />
type Props = {
    children: React.ReactNode;
};
export default function ThemeProvider({ children, themeMode, }: Props & {
    themeMode?: "light" | "dark";
}): import("react").JSX.Element;
export {};
//# sourceMappingURL=index.d.ts.map