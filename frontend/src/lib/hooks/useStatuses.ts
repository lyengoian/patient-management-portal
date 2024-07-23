import { useState, useEffect } from "react";
import axios from "axios";
import { Status } from "../types/types";

const useStatuses = () => {
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [statusError, setStatusError] = useState("");

  useEffect(() => {
    fetchStatuses();
  }, []);

  const fetchStatuses = () => {
    axios
      .get("http://localhost:4000/api/statuses")
      .then((response) => setStatuses(response.data))
      .catch(() => {
        setStatusError("There was an error fetching the statuses.");
      });
  };

  return { statuses, setStatuses, fetchStatuses, statusError, setStatusError };
};

export default useStatuses;
