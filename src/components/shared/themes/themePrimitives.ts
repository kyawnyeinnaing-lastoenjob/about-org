import { webfontFamily } from "@/app/font";
import { alpha, createTheme, Shadows } from "@mui/material/styles";

declare module "@mui/material/Paper" {
  interface PaperPropsVariantOverrides {
    highlighted: true;
  }
}
declare module "@mui/material/styles/createPalette" {
  interface ColorRange {
    50: string;
    100: string;
    150: string;
    200: string;
    250: string;
    300: string;
    350: string;
    400: string;
    450: string;
    500: string;
    550: string;
    600: string;
    700: string;
    750: string;
    800: string;
    850: string;
    900: string;
    950: string;
  }

  interface Palette {
    baseShadow: string;
    colors: {
      black: string;
      white: string;
      gray: ColorRange;
      orange: ColorRange;
      blue: ColorRange;
      red: ColorRange;
      green: ColorRange;
    };
    disabled: {
      color: string;
    };
  }
}

const defaultTheme = createTheme();

// const customShadows: Shadows = [...defaultTheme.shadows];

export const brand = {
  50: "hsl(210, 100%, 95%)",
  100: "hsl(210, 100%, 92%)",
  200: "hsl(210, 100%, 80%)",
  300: "hsl(210, 100%, 65%)",
  400: "hsl(210, 98%, 48%)",
  500: "hsl(210, 98%, 42%)",
  600: "hsl(210, 98%, 55%)",
  700: "hsl(210, 100%, 35%)",
  800: "hsl(210, 100%, 16%)",
  900: "hsl(210, 100%, 21%)",
};

export const gray = {
  10: "#F3F3F3",
  50: "#F5F7F8",
  100: "#E9EBED",
  200: "hsl(220, 20%, 88%)",
  300: "hsl(220, 20%, 80%)",
  400: "#8A8D9C",
  500: "#636570",
  600: "hsl(220, 20%, 35%)",
  700: "hsl(220, 20%, 25%)",
  800: "#353535",
  850: "#0E101B",
  900: "#0E1019",
};

export const green = {
  50: "hsl(120, 80%, 98%)",
  100: "hsl(120, 75%, 94%)",
  200: "hsl(120, 75%, 87%)",
  300: "hsl(120, 61%, 77%)",
  400: "hsl(120, 44%, 53%)",
  500: "hsl(120, 59%, 30%)",
  600: "hsl(120, 70%, 25%)",
  700: "hsl(120, 75%, 16%)",
  800: "hsl(120, 84%, 10%)",
  900: "hsl(120, 87%, 6%)",
};

export const orange = {
  50: "hsl(45, 100%, 97%)",
  100: "hsl(45, 92%, 90%)",
  200: "hsl(45, 94%, 80%)",
  300: "hsl(45, 90%, 65%)",
  400: "hsl(45, 90%, 40%)",
  500: "hsl(45, 90%, 35%)",
  600: "hsl(45, 91%, 25%)",
  700: "hsl(45, 94%, 20%)",
  800: "hsl(45, 95%, 16%)",
  900: "hsl(45, 93%, 12%)",
};

export const red = {
  50: "#FFEBEA",
  100: "#F6CDCB",
  200: "#F0ABA7",
  300: "#F13D2F",
  400: "#C7261A",
  500: "#ED0000",
  600: "#D90000",
  700: "#FCA7A5",
  800: "hsl(0, 95%, 12%)",
  900: "hsl(0, 93%, 6%)",
};

export const colorSchemes = {
  light: {
    palette: {
      primary: {
        light: brand[200],
        main: brand[400],
        dark: brand[700],
        contrastText: brand[50],
      },
      info: {
        light: brand[100],
        main: brand[300],
        dark: brand[600],
        contrastText: gray[50],
      },
      warning: {
        light: orange[300],
        main: orange[400],
        dark: orange[800],
      },
      error: {
        light: red[300],
        main: red[400],
        dark: red[800],
      },
      success: {
        light: green[300],
        main: green[400],
        dark: green[800],
      },
      grey: {
        ...gray,
      },
      divider: alpha(gray[300], 0.4),
      background: {
        default: "hsl(0, 0%, 99%)",
        paper: "hsl(220, 35%, 97%)",
      },
      text: {
        primary: gray[800],
        secondary: gray[600],
        warning: orange[400],
      },
      action: {
        hover: alpha(gray[200], 0.2),
        selected: `${alpha(gray[200], 0.3)}`,
      },
      baseShadow:
        "hsla(220, 30%, 5%, 0.07) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.07) 0px 8px 16px -5px",
      disabled: {
        color: "#8E8E8E",
      },
      colors: {
        white: "#ffffff",
        black: "#000000",
        gray: {
          50: "#F5F5F5",
          100: "#F6F7F8",
          300: "#D7D7D7",
          400: "#BCBCBC",
          450: "#A4A4A4",
          500: "#A5A5A5",
          550: "#636570",
          600: "#656565",
          700: "#8C8C8C",
          800: "#353535",
          850: "#2F2F2F",
          900: "#1E1E1E",
          950: "#1B1B1B",
        },
        orange: {
          100: "#FFFCEF",
          150: "#FFF0EB",
          200: "#F5F7F8",
          250: "#FFF5F2",
          300: "#D9C886",
          350: "#F7D4C9",
          400: "#EED367",
          500: "#FFD600",
          600: "#EFB821",
          700: "#E99700",
          900: "#d95428",
        },
        blue: {
          50: "#E7F1FF",
          100: "#EDF4FF",
          150: "#E9F1FD",
          200: "#D6E6FF",
          250: "#8699A7",
          300: "#5C768B",
          350: "#B2D2FF",
          400: "#156FF1",
          450: "#0055CF",
          600: "#014DAB",
          700: "#2373E6",
          750: "#00477E",
          800: "#1D0894",
          900: "#170481",
          950: "#14046A",
        },
        red: {
          400: "#DD1E1E",
        },
        green: {
          100: "#1D2C38",
        },
      },
    },
  },
  dark: {
    palette: {
      primary: {
        contrastText: brand[50],
        light: brand[300],
        main: brand[400],
        dark: brand[700],
      },
      info: {
        contrastText: brand[300],
        light: brand[500],
        main: brand[700],
        dark: brand[900],
      },
      warning: {
        light: orange[400],
        main: orange[500],
        dark: orange[700],
      },
      error: {
        light: red[400],
        main: red[500],
        dark: red[700],
      },
      success: {
        light: green[400],
        main: green[500],
        dark: green[700],
      },
      grey: {
        ...gray,
      },
      divider: alpha(gray[700], 0.6),
      background: {
        default: gray[900],
        paper: "hsl(220, 30%, 7%)",
      },
      text: {
        primary: "hsl(0, 0%, 100%)",
        secondary: gray[400],
      },
      action: {
        hover: alpha(gray[600], 0.2),
        selected: alpha(gray[600], 0.3),
      },
      baseShadow:
        "hsla(220, 30%, 5%, 0.7) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.8) 0px 8px 16px -5px",
    },
  },
};

export const typography = {
  fontFamily: webfontFamily,
  h1: {
    fontSize: defaultTheme.typography.pxToRem(48),
    fontWeight: 600,
    lineHeight: 1.2,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: defaultTheme.typography.pxToRem(36),
    fontWeight: 600,
    lineHeight: 1.2,
  },
  h3: {
    fontSize: defaultTheme.typography.pxToRem(30),
    lineHeight: 1.2,
  },
  h4: {
    fontSize: defaultTheme.typography.pxToRem(24),
    fontWeight: 600,
    lineHeight: 1.5,
  },
  h5: {
    fontSize: defaultTheme.typography.pxToRem(20),
    fontWeight: 600,
  },
  h6: {
    fontSize: defaultTheme.typography.pxToRem(18),
    fontWeight: 600,
  },
  subtitle1: {
    fontSize: defaultTheme.typography.pxToRem(18),
  },
  subtitle2: {
    fontSize: defaultTheme.typography.pxToRem(14),
    fontWeight: 500,
  },
  body1: {
    fontSize: defaultTheme.typography.pxToRem(14),
  },
  body2: {
    fontSize: defaultTheme.typography.pxToRem(14),
    fontWeight: 400,
  },
  caption: {
    fontSize: defaultTheme.typography.pxToRem(12),
    fontWeight: 400,
  },
};

// @ts-expect-error: Prop not typed in component library
const defaultShadows: Shadows = [
  // "var(--mui-palette-baseShadow)",
  ...defaultTheme.shadows[24],
];
export const shadows = defaultShadows;
