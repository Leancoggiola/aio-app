import { createTheme } from "@mantine/core";

import { ComponentsOverride } from "./components";

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
      "#FFF4E2", // 0
      "#FDE4BC", // 1
      "#E8C9A2", // 2
      "#D3AB80", // 3
      "#B89379", // 4
      "#96786F", // 5
      "#6B4A45", // 6
      "#472825", // 7
      "#3A211F", // 8
      "#2E1A18", // 9
    ],
  },

  defaultRadius: "md",
  radius: {
    none: "0",
    xs: "0.125rem",
    sm: "0.25rem",
    md: "0.5rem",
    lg: "1rem",
    xl: "1.5rem",
    "2xl": "2rem",
    full: "60rem",
  },

  spacing: {
    none: "0",
    "3xs": "0.125rem",
    "2xs": "0.25rem",
    xs: "0.5rem",
    sm: "0.75rem",
    md: "1rem",
    lg: "1.25rem",
    xl: "1.5rem",
    "2xl": "2rem",
    "3xl": "3rem",
    "4xl": "4rem",
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
  components: ComponentsOverride,
});
