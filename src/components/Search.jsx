import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import options from "../assets/ski_resorts_japan.json";
import { InputAdornment } from "@mui/material";
import Box from "@mui/material/Box";

const Search = ({ skiTargetID, setSkiTargetID }) => {
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [searchInput, setSearchInput] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);

  useEffect(() => {
    const selected = skiTargetID
      ? options.filter((option) => skiTargetID.includes(option.skiID))
      : [];
    setSelectedOptions(selected);
    setSearchInput(selected.map((option) => option.skiID));
  }, [skiTargetID]);

  const handleSearchClick = () => {
    setSkiTargetID(searchInput);
  };

  const handleOptionChange = (event, newValues) => {
    if (newValues) {
      const newIDs = newValues.map((value) => value.skiID);
      setSearchInput(newIDs);
      setSkiTargetID(newIDs);
    } else {
      setSearchInput([]);
      setSkiTargetID([]);
    }
  };

  return (
    <Box sx={{ width: 500 }}>
      <Autocomplete
        multiple
        options={filteredOptions}
        getOptionLabel={(option) => (option && option.name) || ""}
        value={selectedOptions}
        onChange={handleOptionChange}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            label="Search Ski Resorts"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {params.InputProps.endAdornment}
                  <InputAdornment position="end"></InputAdornment>
                </>
              ),
              disableUnderline: true,
            }}
            sx={{
              "& .MuiAutocomplete-inputRoot": {
                display: "flex",
                flexWrap: "wrap",
                maxHeight: "100px",
                overflowY: "auto",
                borderBottom: "1px solid rgba(0, 0, 0, 0.42)",
              },
              "& .MuiAutocomplete-input": {
                minWidth: "0",
              },
              "& .MuiInputBase-root": {
                alignItems: "flex-start",
                paddingBottom: "10px",
              },
              "& .MuiFormLabel-root": {
                transform: "translate(14px, 10px) scale(1)",
              },
              "& .MuiInputLabel-shrink": {
                transform: "translate(0, -1.5px) scale(0.75)",
              },
            }}
          />
        )}
      />
    </Box>
  );
};

export default Search;
