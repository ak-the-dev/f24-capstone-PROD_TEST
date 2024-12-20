import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountBoxIcon from "@mui/icons-material/AccountBox";

/**
 * Width of the side drawer in pixels.
 * @constant
 * @type {number}
 */
const drawerWidth = 240;

/**
 * Styled Main component using Material-UI's styled API.
 * Adjusts margin based on the drawer's open state.
 *
 * @constant
 * @type {React.ComponentType}
 */
const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

/**
 * Styled DrawerHeader component to ensure content is below the AppBar.
 *
 * @constant
 * @type {React.ComponentType}
 */
const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // Necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

/**
 * Layout component.
 * Provides a consistent layout with AppBar and Drawer for navigation across the application.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {React.ReactNode} props.children - Child components to render within the layout.
 * @returns {JSX.Element} The rendered Layout component.
 */
const Layout = ({ children }) => {
  /**
   * State to manage the open/close state of the drawer.
   * @type {[boolean, Function]}
   */
  const [open, setOpen] = useState(false);

  /**
   * React Router's navigate function.
   * Used to programmatically navigate between routes.
   *
   * @type {import('react-router-dom').NavigateFunction}
   */
  const navigate = useNavigate();

  /**
   * Toggles the open state of the drawer.
   *
   * @function handleDrawerToggle
   * @returns {void}
   */
  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  /**
   * Array of menu items to display in the drawer.
   * Each item includes text, an icon, and the path to navigate to.
   *
   * @type {Array<Object>}
   * @property {string} text - The display text of the menu item.
   * @property {React.ReactElement} icon - The icon to display alongside the text.
   * @property {string} path - The route path to navigate to when the item is clicked.
   */
  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
    { text: "My Profile", icon: <AccountBoxIcon />, path: "/profile" },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      {/* AppBar at the top of the application */}
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "#017d84",
          zIndex: (theme) => theme.zIndex.drawer + 1, // Ensures AppBar appears above Drawer
        }}
      >
        <Toolbar>
          {/* IconButton to toggle the Drawer */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          {/* Spacer to push the logout button to the right */}
          <Box sx={{ flexGrow: 1 }} />
          {/* Logout Button */}
          <Button color="inherit" sx={{ color: "#98E1DA" }}>
            LOGOUT
          </Button>
        </Toolbar>
      </AppBar>

      {/* Side Drawer for navigation */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#017d84",
            paddingTop: "64px", // Height of AppBar to avoid overlap
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton onClick={() => navigate(item.path)}>
                {/* Icon for the menu item */}
                <ListItemIcon sx={{ color: "#98E1DA" }}>
                  {item.icon}
                </ListItemIcon>
                {/* Text for the menu item */}
                <ListItemText primary={item.text} sx={{ color: "#98E1DA" }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main content area */}
      <Main open={open}>
        <DrawerHeader />
        {/* Render child components passed to the Layout */}
        {children}
      </Main>
    </Box>
  );
};

export default Layout;
