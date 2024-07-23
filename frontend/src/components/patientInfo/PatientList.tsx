import React, { useContext } from "react";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import PatientListItem from "./PatientListItem";
import { AppContext } from "../../lib/contexts/AppContext";

const PatientList: React.FC = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("AppContext must be used within an AppProvider");
  }

  const { filteredPatients } = context;

  return (
    <List
      sx={{
        width: "100%",
        maxWidth: "100%",
        bgcolor: "background.paper",
        borderRadius: "15px",
        padding: "10px",
      }}
    >
      {filteredPatients.length > 0 ? (
        filteredPatients.map((patient, index) => (
          <PatientListItem key={patient.id} patient={patient} index={index} />
        ))
      ) : (
        <Typography
          margin="auto"
          width="fit-content"
          color="primary"
          variant="h6"
        >
          Your patient dashboard is empty. Get started by adding new patients.
        </Typography>
      )}
    </List>
  );
};

export default PatientList;
