import React, { useContext } from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../../lib/assets/theme";
import LoginForm from "../authentication/LoginForm";
import PatientAppBar from "./AppBar";
import PatientList from "../patientInfo/PatientList";
import EditPersonDialog from "../patientActions/dialogs/EditPersonDialog";
import AddPersonDialog from "../patientActions/dialogs/AddPersonDialog";
import DeletePersonDialog from "../patientActions/dialogs/DeletePersonDialog";
import InfoCard from "../patientInfo/InfoCard";
import AlertMessage from "../alerts/AlertMessage";
import { Toolbar } from "@mui/material";
import { AppProvider, AppContext } from "../../lib/contexts/AppContext";

const App: React.FC = () => {
  return (
    <AppProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Content />
      </ThemeProvider>
    </AppProvider>
  );
};

const Content: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("AppContext must be used within an AppProvider");
  }
  const { user } = context;

  return user ? (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <PatientAppBar />
      <Box
        component="main"
        sx={{
          p: 3,
          width: "100%",
          backgroundColor: "#F0EADF",
          height: "100vh",
        }}
      >
        <Toolbar />
        <AlertMessage />
        <EditPersonDialog />
        <AddPersonDialog />
        <DeletePersonDialog />
        <InfoCard />
        <PatientList />
      </Box>
    </Box>
  ) : (
    <LoginForm />
  );
};

export default App;
