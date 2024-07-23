import React, { useContext } from "react";
import { TextField, Box, InputAdornment } from "@mui/material";
import { AppContext } from "../../lib/contexts/AppContext";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";

const SearchBar: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("AppContext must be used within an AppProvider");
  }
  const { searchQuery, setSearchQuery } = context;

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  return (
    <Box
      sx={{
        borderRadius: "50px",
        backgroundColor: "white",
        marginBottom: 2,
      }}
    >
      <TextField
        variant="outlined"
        placeholder="Search patients by name, date of birth, city, state, status, etc. Use ';' to separate multiple criteria."
        value={searchQuery}
        onChange={handleSearchChange}
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <PersonSearchIcon color="primary" />
            </InputAdornment>
          ),
        }}
        sx={{
          flex: 1,
          "& .MuiOutlinedInput-root": {
            borderRadius: "50px",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "transparent",
          },
        }}
      />
    </Box>
  );
};

export default SearchBar;
