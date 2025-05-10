export const BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const PROJECT_NAME = "Project";

export const ROUTE = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  LOGIN: "/login",
  AUTH: "/auth",
  ABOUT: "/about",
  CONTACT: "/contact",
  PRODUCT: "/product",
  FORM: "/form",
};
export const paperProps = {
  elevation: 0,
  sx: {
    overflow: "visible",
    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
    mt: "10px",
    "&:before": {
      content: '""',
      display: "block",
      position: "absolute",
      top: 0,
      right: 14,
      width: 10,
      height: 10,
      bgcolor: "background.paper",
      transform: "translateY(-50%) rotate(45deg)",
      zIndex: 0,
    },
  },
};

export const INITIAL_MODAL_STATE = {
  open: false,
  type: "",
};
