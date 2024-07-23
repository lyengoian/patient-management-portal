import { useState, useEffect } from "react";
import axios from "axios";
import { Patient, Status } from "../types/types";

const usePatients = (statuses: Status[]) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [openError, setOpenError] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    loadPatients();
  }, []);

  useEffect(() => {
    filterPatients();
  }, [searchQuery, patients, statuses]);

  const loadPatients = () => {
    axios
      .get("http://localhost:4000/api/patients")
      .then((response) => setPatients(response.data))
      .catch(() => {
        setMessage(
          "There was an error fetching the patients. Please try again."
        );
        setOpenError(true);
      });
  };

  const filterPatients = () => {
    if (!searchQuery) {
      setFilteredPatients(patients);
    } else {
      const filters = searchQuery.split(";").map((f) => f.trim().toLowerCase());
      setFilteredPatients(
        patients.filter((patient) => {
          return filters.every((filter) => {
            return (
              patient.first_name.toLowerCase().includes(filter) ||
              patient.last_name.toLowerCase().includes(filter) ||
              patient.date_of_birth.includes(filter) ||
              patient.addresses.some(
                (address) =>
                  address.city.toLowerCase().includes(filter) ||
                  address.state.toLowerCase().includes(filter) ||
                  address.zipCode.toLowerCase().includes(filter) ||
                  address.addressLine1.toLowerCase().includes(filter) ||
                  address.addressLine2?.toLowerCase().includes(filter)
              ) ||
              patient.additional_fields.some(
                (field) =>
                  field.fieldName.toLowerCase().includes(filter) ||
                  field.fieldValue.toLowerCase().includes(filter)
              ) ||
              patient.status_name.toLowerCase().includes(filter)
            );
          });
        })
      );
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (openError) {
      timer = setTimeout(() => {
        setOpenError(false);
      }, 3000);
    }
    if (openSuccess) {
      timer = setTimeout(() => {
        setOpenSuccess(false);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [openError, openSuccess]);

  return {
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
  };
};

export default usePatients;
