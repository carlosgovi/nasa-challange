import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import React from "react";

const Header = () => {
  return (
    <AppBar position="static" color="primary">
      <Toolbar variant="dense">
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          Nasa IMG
        </IconButton>
        <Typography variant="h6" color="inherit" component="div">
          Photos
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export { Header };
