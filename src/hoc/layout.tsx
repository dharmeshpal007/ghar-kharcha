import React, { FC, PropsWithChildren, useState, useEffect } from "react";
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Tooltip, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router";
import { colors } from "../assets/styles/Owntheme";
import { ROUTE } from "../shared/constants/constants";
import { DashboardMenuIcon } from "../shared/icons/icons";
import { Drawer, DrawerHeader, StyledIconButton } from "./Layout.styles";
import LayoutHeader from "./LayoutHeader";
import { MenuOpen, Menu } from "@mui/icons-material";

interface Props {
  sideBarOpen: boolean;
}

const Layout: FC<PropsWithChildren<Props>> = ({ children, sideBarOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(typeof window !== "undefined" ? window.innerWidth > 768 : false);

  const renderIconButton = (id: string, method: () => void, icon: React.ReactNode) => (
    <StyledIconButton onClick={method} id={id} data-testid={id}>
      {icon}
    </StyledIconButton>
  );

  // Update `open` state on window resize
  useEffect(() => {
    const handleResize = () => {
      setOpen(window.innerWidth > 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const pathNameMatcher = (path: string) => location.pathname.startsWith(path);

  const handleListItemClick = (url: string) => {
    if (url !== location.pathname) {
      navigate(url);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      {sideBarOpen && (
        <Drawer
          variant="permanent"
          open={open}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            backgroundColor: "red",
          }}
        >
          {/* <DrawerHeader
            style={{
              borderBottom: "1px solid #E0E0E0",
            }}
          >
            {open ? (
              <Box sx={{ height: "30px", width: "100%", marginLeft: "25px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography
                  sx={{
                    fontWeight: "bold",
                  }}
                >
                  LOGO
                </Typography>

                {open ? renderIconButton("openDrawer", () => setOpen(false), <MenuOpen />) : renderIconButton("closeDrawer", () => setOpen(true), <Menu />)}
              </Box>
            ) : (
              <Box sx={{ height: "30px", width: "100%", marginLeft: "25px" }}>
                <Typography
                  sx={{
                    fontWeight: "bold",
                  }}
                >
                  LOGO
                </Typography>
              </Box>
            )}
          </DrawerHeader> */}

          <DrawerHeader>
            {open && (
              <Box sx={{ height: "30px", width: "100%" }}>
                {/* <img alt="ssh_logo" src={Logo} style={{ margin: "0px 0px 0 25px", height: "100%" }} /> */}
                <Typography
                  sx={{
                    fontWeight: "bold",
                    marginLeft: "25px",
                  }}
                >
                  LOGO
                </Typography>
              </Box>
            )}
            {open ? renderIconButton("openDrawer", () => setOpen(false), <MenuOpen />) : renderIconButton("closeDrawer", () => setOpen(true), <Menu />)}
          </DrawerHeader>
          <List>
            {[
              {
                title: "Dashboard",
                label: "Dashboard",
                url: ROUTE.DASHBOARD,
                icon: <DashboardMenuIcon color={location.pathname.startsWith(ROUTE.DASHBOARD) ? colors.primary.main : "#7A7C7F"} />,
              },
              {
                title: "About",
                label: "About",
                url: ROUTE.ABOUT,
                icon: <DashboardMenuIcon color={location.pathname.startsWith(ROUTE.DASHBOARD) ? colors.primary.main : "#7A7C7F"} />,
              },
              {
                title: "Product",
                label: "Product",
                url: ROUTE.PRODUCT,
                icon: <DashboardMenuIcon color={location.pathname.startsWith(ROUTE.DASHBOARD) ? colors.primary.main : "#7A7C7F"} />,
              },
            ].map((item) => (
              <Tooltip
                key={item.label}
                arrow
                title={item.title}
                placement="right"
                data-testid="tooltip"
                PopperProps={{
                  modifiers: [
                    {
                      name: "offset",
                      options: {
                        offset: [0, -10],
                      },
                    },
                  ],
                }}
              >
                <ListItem
                  disablePadding
                  sx={{
                    display: "block",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      width: "5px",
                      height: "48px",
                      backgroundColor: pathNameMatcher(item.url as string) ? "#3183FF" : "",
                      zIndex: pathNameMatcher(item.url as string) ? 1 : 0,
                    },
                  }}
                >
                  <ListItemButton
                    id="listItemButton"
                    onClick={() => handleListItemClick(item.url as string)}
                    data-testid="listItemButton"
                    selected={pathNameMatcher(item.url as string)}
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                      color: pathNameMatcher(item.url as string) ? `${colors.primary.main} !important` : "#7A7C7F",
                      backgroundColor: pathNameMatcher(item.url as string) ? colors.gray.main : "",
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                        color: pathNameMatcher(item.url as string) ? colors.gray.main : "#7A7C7F",
                      }}
                    >
                      {item.icon as React.JSX.Element}
                    </ListItemIcon>
                    <ListItemText primary={item.label} sx={{ opacity: open ? 1 : 0 }} />
                  </ListItemButton>
                </ListItem>
              </Tooltip>
            ))}
          </List>
        </Drawer>
      )}
      <Box
        component={"main"}
        width={!sideBarOpen ? "100%" : open ? "calc(100vw - 254px)" : "calc(100vw - 69px)"}
        sx={{
          backgroundColor: "#F3F3F4",
          minHeight: "100vh",
          position: "relative",
          transition: "width 0.3s ease",
        }}
      >
        <LayoutHeader isDrawerOpen={open} />

        <Box
          sx={{
            padding: "0 20px",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
