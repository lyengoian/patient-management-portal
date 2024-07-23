import React, { useContext } from "react";
import { Alert, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { AppContext } from "../../lib/contexts/AppContext";

const AlertMessage: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("AppContext must be used within an AppProvider");
  }

  const {
    openSuccess,
    openError,
    message,
    setOpenSuccess,
    setOpenError,
    statusError,
  } = context;

  const open = openSuccess || openError;
  const severity = openSuccess ? "success" : "error";

  const handleClose = () => {
    if (openSuccess) setOpenSuccess(false);
    if (openError) setOpenError(false);
  };

  if ((!open || !message) && !openError && !statusError) return null;

  return (
    <Alert
      sx={{ margin: "auto", marginBottom: 1, width: "fit-content" }}
      severity={severity}
      action={
        <IconButton
          aria-label="close"
          color="inherit"
          size="small"
          onClick={handleClose}
        >
          <CloseIcon fontSize="inherit" />
        </IconButton>
      }
    >
      {message}
    </Alert>
  );
};

export default AlertMessage;
