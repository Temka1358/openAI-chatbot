import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Logo from "./shared/Logo";
import { useAuth } from "../context/AuthContext";
import NavigationLink from "./shared/NavigationLink";
import { useTranslation } from 'react-i18next';
import { Select, MenuItem, Box, IconButton } from '@mui/material';
import { MdLanguage } from 'react-icons/md'; // Importing the icon

const Header = () => {
  const auth = useAuth();
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = React.useState(i18n.language);
  const [open, setOpen] = React.useState(false);

  const handleChangeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setLanguage(lng);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <AppBar
      sx={{ bgcolor: "transparent", position: "static", boxShadow: "none" }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Logo />
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {auth?.isLoggedIn ? (
            <>
              <NavigationLink
                bg="#004d56"
                to="/chat"
                text={t("goToChat")}
                textColor="white"
              />
              <NavigationLink
                bg="#004d56"
                textColor="white"
                to="/"
                text={t("logout")}
                onClick={auth.logout}
              />
            </>
          ) : (
            <>
              <NavigationLink
                bg="#004d56"
                to="/login"
                text={t("login")}
                textColor="white"
              />
              <NavigationLink
                bg="#004d56"
                textColor="white"
                to="/signup"
                text={t("signup")}
              />
            </>
          )}
          <Box sx={{ marginLeft: 2, display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={handleOpen}>
              <MdLanguage size={24} color="#004d56"/>
            </IconButton>
            <Select
              open={open}
              onClose={handleClose}
              onOpen={handleOpen}
              value={language}
              onChange={(e) => handleChangeLanguage(e.target.value as string)}
              displayEmpty
              inputProps={{ 'aria-label': 'Language selector' }} // For accessibility
              variant="standard" // Use standard variant to remove default border
              sx={{ 
                color: '#004d56', 
                '&::before': { borderBottom: 'none' }, // Remove bottom border
                '&::after': { borderBottom: 'none' }, // Remove focus border
                '&:hover:not(.Mui-disabled):before': { borderBottom: 'none' } // Remove hover border
              }}
            >
              <MenuItem value="en" sx={{ color: 'black' }}>
                EN
              </MenuItem>
              <MenuItem value="jp" sx={{ color: 'black' }}>
                JP
              </MenuItem>
            </Select>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
