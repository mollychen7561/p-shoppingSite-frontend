import type * as MaterialTailwind from "@material-tailwind/react";

declare module "@material-tailwind/react" {
  // 更正 Typography 組件的類型
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface TypographyProps
    extends React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    > {
    as?: string;
    variant?: string;
    color?: string;
    textGradient?: boolean;
  }
}
