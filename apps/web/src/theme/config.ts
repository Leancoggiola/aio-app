import { createTheme, Paper, PasswordInput, TextInput } from "@mantine/core";

export const THEME = createTheme({
  fontFamily: "'Open Sans', sans-serif",
  primaryColor: "primary",
  primaryShade: 6,

  cursorType: "pointer",

  // Colors
  autoContrast: true,
  black: "#1F1413",
  colors: {
    primary: [
      "#FFF4E2",
      "#FDE4BC",
      "#E8C9A2",
      "#D3AB80",
      "#B89379",
      "#96786F",
      "#6B4A45",
      "#472825",
      "#3A211F",
      "#2E1A18",
    ],
  },

  defaultRadius: "md",
  radius: {
    none: "0px",
    xs: "2px",
    sm: "4px",
    md: "8px",
    lg: "16px",
    xl: "24px",
    "2xl": "32px",
    full: "960px",
  },

  spacing: {
    none: "0px",
    "3xs": "2px",
    "2xs": "4px",
    xs: "8px",
    sm: "12px",
    md: "16px",
    lg: "20px",
    xl: "24px",
    "2xl": "32px",
    "3xl": "48px",
    "4xl": "64px",
  },
  breakpoints: {
    xs: "30em",
    sm: "48em",
    md: "62em",
    lg: "75em",
    xl: "90em",
  },

  shadows: {
    xs: "0px 3px 5px 0px rgba(0, 0, 0, 0.02), 0px 3px 12px 0px rgba(0, 0, 0, 0.03)",
    sm: "0px 4px 6px 0px rgba(0, 0, 0, 0.02), 0px 5px 20px 0px rgba(0, 0, 0, 0.05)",
    md: "0px 4px 8px 0px rgba(0, 0, 0, 0.05), 0px 5px 30px 0px rgba(0, 0, 0, 0.1)",
    lg: "0px 8px 10px 0px rgba(0, 0, 0, 0.08), 0px 8px 30px 0px rgba(0, 0, 0, 0.12)",
    xl: "0px 8px 10px 0px rgba(0, 0, 0, 0.08), 0px 8px 30px 0px rgba(0, 0, 0, 0.12)",
  },
  components: {
    Paper: Paper.extend({ defaultProps: { p: "md", shadow: "sm" } }),
    PasswordInput: PasswordInput.extend({ defaultProps: { size: "md" } }),
    TextInput: TextInput.extend({ defaultProps: { size: "md" } }),
  },
});
