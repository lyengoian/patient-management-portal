import { User } from "firebase/auth";
import React, { createContext, useState, ReactNode } from "react";
import useAuth from "../hooks/useAuth";
import usePatients from "../hooks/usePatients";
import useStatuses from "../hooks/useStatuses";
import { Patient, Status } from "../types/types";

interface AppContextProps {
  selectedIndex: number | null;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
  dialogOpen: boolean;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  infoCardOpen: boolean;
  setInfoCardOpen: React.Dispatch<React.SetStateAction<boolean>>;
  addDialogOpen: boolean;
  setAddDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  deleteDialogOpen: boolean;
  setDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  patients: Patient[];
  filteredPatients: Patient[];
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
  selectedPatientId: number | null;
  setSelectedPatientId: React.Dispatch<React.SetStateAction<number | null>>;
  openSuccess: boolean;
  setOpenSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  openError: boolean;
  setOpenError: React.Dispatch<React.SetStateAction<boolean>>;
  message: string | null;
  setMessage: React.Dispatch<React.SetStateAction<string | null>>;
  statuses: Status[];
  setStatuses: React.Dispatch<React.SetStateAction<Status[]>>;
  statusError: string;
  setStatusError: React.Dispatch<React.SetStateAction<string>>;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loadPatients: () => void;
  fetchStatuses: () => void;
  handleLogout: () => void;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  showSignedUp: boolean;
  setShowSignedUp: React.Dispatch<React.SetStateAction<boolean>>;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [infoCardOpen, setInfoCardOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(
    null
  );
  const [showSignedUp, setShowSignedUp] = useState(false);

  const { user, handleLogout, setUser } = useAuth();
  const { statuses, setStatuses, fetchStatuses, statusError, setStatusError } =
    useStatuses();
  const {
    patients,
    setPatients,
    filteredPatients,
    searchQuery,
    setSearchQuery,
    message,
    openError,
    openSuccess,
    setOpenError,
    setOpenSuccess,
    setMessage,
    loadPatients,
  } = usePatients(statuses);

  return (
    <AppContext.Provider
      value={{
        selectedIndex,
        setSelectedIndex,
        dialogOpen,
        setDialogOpen,
        infoCardOpen,
        setInfoCardOpen,
        addDialogOpen,
        setAddDialogOpen,
        deleteDialogOpen,
        setDeleteDialogOpen,
        patients,
        setPatients,
        filteredPatients,
        selectedPatientId,
        setSelectedPatientId,
        openSuccess,
        setOpenSuccess,
        openError,
        setOpenError,
        message,
        setMessage,
        statuses,
        setStatuses,
        statusError,
        setStatusError,
        user,
        setUser,
        loadPatients,
        fetchStatuses,
        handleLogout,
        searchQuery,
        setSearchQuery,
        showSignedUp,
        setShowSignedUp,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
