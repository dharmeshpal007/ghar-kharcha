import { FC, HtmlHTMLAttributes } from "react";
import { styled, Drawer as MuiDrawer, Theme, CSSObject, IconButton, SxProps } from "@mui/material";
import { colors } from "../assets/styles/Owntheme";

export const drawerWidth = 250;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: "ease",
    duration: "0.3s",
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: "ease",
    duration: "0.3s",
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

export const DrawerHeader: FC<HtmlHTMLAttributes<HTMLDivElement>> = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  ...theme.mixins.toolbar,
  height: "77px",
}));

export const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== "open" })(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  boxShadow: "4px 0px 8px 0px #0000001A",

  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
})) as typeof MuiDrawer;

export const StyledIconButton = styled(IconButton)({
  backgroundColor: colors.primary.main,
  color: colors.white.main,
  "&:hover": {
    backgroundColor: colors.primary.main,
  },
  borderRadius: "3px 0 0 3px",
  width: "42px",
}) as typeof IconButton;

export const leftPanelTextRoot = {
  paddingLeft: "20px",
  bottom: "10px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  position: "absolute",
} as SxProps;

export const leftPanelText = {
  fontSize: "12px",
  fontWeight: "500",
  marginBottom: "15px",
  letterSpacing: "0.01em",
  textAlign: "left",
  color: "#8D8E92",
} as SxProps;
