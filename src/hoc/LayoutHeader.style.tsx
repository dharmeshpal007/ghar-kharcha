import { SxProps } from "@mui/material";
import { colors } from "../assets/styles/Owntheme";

const mainRoot = {
  height: "80px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 10px 0 10px",
  position: "sticky",
  gap: "20px",
  top: "0",
  backgroundColor: "#F3F3F4",
  zIndex: 10,
} as SxProps;

const timelineRoot = {
  fontSize: "12px",
  backgroundColor: "#7A7C7F",
  border: `1px dashed #BE3646`,
  borderRadius: "20px",
  padding: "5px 10px",
  animation: "zoom-in-zoom-out 2s ease-out infinite",
} as SxProps;

const timeline = {
  color: "#BE3646",
  fontSize: "inherit",
  fontWeight: "inherit",
} as SxProps;

const timelineBold = {
  color: "inherit",
  fontSize: "inherit",
  fontWeight: 600,
} as SxProps;

const infoRoot = { display: "flex", alignItems: "center" } as SxProps;
const infoBox = {
  display: "flex",
  alignItems: "center",
  marginLeft: { xs: "0", md: "0", lg: "12px" },
  cursor: "pointer",
} as SxProps;
const avatar = {
  backgroundColor: colors.primary.main,
  width: "40px",
  height: "40px",
} as SxProps;

const nameBox = { marginRight: "10px" } as SxProps;
const name = {
  fontSize: "13px",
  fontWeight: 600,
  color: colors.primary.main,
  display: { xs: "none", md: "none", lg: "block" },
} as SxProps;
const companyName = {
  fontSize: "12px",
  fontWeight: 500,
  color: "7A7C7F",
} as SxProps;
const menuItem = { "&:focus:not(:hover)": { backgroundColor: "transparent" } } as SxProps;
const icon = { fontSize: "large" } as SxProps;
const layoutNavbarRoot = {
  borderBottom: "1px solid #E0E0E0",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  height: "77px",
  padding: "0 20px",
  position: "sticky",
  gap: "20px",
  top: "0",
  backgroundColor: "#F3F3F4",
  zIndex: 10,
} as SxProps;
export { mainRoot, timelineRoot, timeline, timelineBold, avatar, infoRoot, name, companyName, menuItem, icon, nameBox, infoBox, layoutNavbarRoot };
