import { createTheme } from "@mui/material";
export const colors = {
  primary: {
    main: "#0C3867",
    dark: "#082748",
    light: "#3c5f85",
  },
  gray: {
    main: "#F5F7FB",
  },
  white: {
    main: "#FFFFFF",
  },
  black: {
    main: "#212429",
    dark: "#000",
    light: "#0000006e",
  },
};

export const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "capitalize",
          borderRadius: "8px",
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        root: {
          borderColor: "#D8D8D8",
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderColor: "#D8D8D8",
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          borderColor: "#D8D8D8",
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: colors.gray.main,
            color: colors.primary.main,
          },
          "&.Mui-selected": {
            backgroundColor: colors.gray.main,
            color: colors.primary.main,
            "&:hover": {
              backgroundColor: colors.gray.main,
            },
          },
        },
      },
    },
  },
  palette: {
    primary: {
      main: colors.primary.main,
      dark: colors.primary.dark,
      light: colors.primary.light,
    },
  },
  typography: {
    fontFamily: "Poppins",
  },
});
