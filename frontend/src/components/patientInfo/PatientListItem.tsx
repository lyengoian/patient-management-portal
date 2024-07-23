import React, { useContext } from "react";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Patient } from "../../lib/types/types";
import { AppContext } from "../../lib/contexts/AppContext";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

interface Props {
  patient: Patient;
  index: number;
}

const PatientListItem: React.FC<Props> = ({ patient, index }) => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("AppContext must be used within an AppProvider");
  }

  const {
    selectedIndex,
    setSelectedIndex,
    setSelectedPatientId,
    setInfoCardOpen,
    setDialogOpen,
    setDeleteDialogOpen,
    fetchStatuses,
  } = context;

  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number,
    patientId: number
  ) => {
    setSelectedIndex(index);
    setSelectedPatientId(patientId);
    setInfoCardOpen(true);
  };

  const handleListItemEditClick = (
    event: any,
    index: number,
    patientId: number
  ) => {
    setSelectedIndex(index);
    setSelectedPatientId(patientId);
    setDialogOpen(true);
    fetchStatuses();
  };

  const handleListItemDeleteClick = (
    event: any,
    index: number,
    patientId: number
  ) => {
    setSelectedIndex(index);
    setSelectedPatientId(patientId);
    setDeleteDialogOpen(true);
  };

  return (
    <ListItem
      sx={{ paddingRight: "7%" }}
      secondaryAction={
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            width: "5vw",
          }}
        >
          <IconButton
            edge="end"
            aria-label="edit"
            onClick={(event) =>
              handleListItemEditClick(event, index, patient.id)
            }
          >
            <EditIcon sx={{ color: "#DE7D41" }} />
          </IconButton>
          <IconButton
            edge="end"
            aria-label="delete"
            onClick={(event) =>
              handleListItemDeleteClick(event, index, patient.id)
            }
          >
            <DeleteIcon sx={{ color: "#913F3D" }} />
          </IconButton>
        </Box>
      }
    >
      <ListItemButton
        selected={selectedIndex === index}
        onClick={(event) => handleListItemClick(event, index, patient.id)}
      >
        <ListItemAvatar>
          <Avatar>
            <PermIdentityIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={`${patient.first_name} ${patient.last_name}`}
          secondary={dayjs(patient.date_of_birth).utc().format("MM-DD-YYYY")}
        />
      </ListItemButton>
    </ListItem>
  );
};

export default PatientListItem;
