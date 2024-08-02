import React, { useContext } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import { Box } from "@mui/material";
import { AppContext } from "../../lib/contexts/AppContext";

const PatientAppBar: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("AppContext must be used within an AppProvider");
  }
  const { handleLogout, setAddDialogOpen, fetchStatuses, setOpenError } =
    context;

  const handleAddPerson = () => {
    setOpenError(false);
    setAddDialogOpen(true);
    fetchStatuses();
  };

  return (
    <AppBar component="nav" sx={{ backgroundColor: "#DE7D41" }}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          sx={{ mr: 2, display: { sm: "none" } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
        >
          Patient Management Portal
        </Typography>
        <Box sx={{ display: { xs: "none", sm: "block" } }}>
          <Button sx={{ color: "#fff" }} onClick={handleAddPerson}>
            <PersonAddAltIcon />
          </Button>
          <Button sx={{ color: "#fff", marginLeft: 2 }} onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default PatientAppBar;
