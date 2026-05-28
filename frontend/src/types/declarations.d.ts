declare module "@tanstack/react-query" {
  export * from "@tanstack/react-query";
}

declare module "react-hot-toast" {
  const toast: any;
  export default toast;
  export const Toaster: any;
}

declare module "next-themes" {
  export function useTheme(): { theme: string; setTheme: (t: string) => void };
  export function ThemeProvider(props: any): any;
}
