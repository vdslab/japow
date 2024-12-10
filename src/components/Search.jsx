import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import IconButton from "@mui/material/IconButton";
import { InputAdornment } from "@mui/material";
import Box from "@mui/material/Box";

const Search = ({ skiTargetID, setSkiTargetID, mapData }) => {
  console.log(mapData);
  const [filteredOptions, setFilteredOptions] = useState(mapData);
  const [searchInput, setSearchInput] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);

  useEffect(() => {
    const selected = skiTargetID
      ? mapData.filter((option) => skiTargetID.includes(option.skiID))
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
    <Box sx={{ height: "100%", display: "flex", alignItems: "center", pl: 3 }}>
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
                  <InputAdornment position="end">
                    <IconButton onClick={handleSearchClick}></IconButton>
                  </InputAdornment>
                </>
              ),
              disableUnderline: true,
            }}
            sx={{
              "& .MuiAutocomplete-inputRoot": {
                display: "flex",
                flexWrap: "wrap",
                maxHeight: "6vh",
                overflowY: "auto",
                overflowX: "hidden",
                whiteSpace: "nowrap",
                borderBottom: "1px solid rgba(0, 0, 0, 0.42)",
              },
              "& .MuiAutocomplete-input": {
                minWidth: 0,
              },
              "& .MuiInputBase-root": {
                alignItems: "flex-start",
                paddingBottom: "10px",
                minWidth: 500,
                maxWidth: 500,
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
