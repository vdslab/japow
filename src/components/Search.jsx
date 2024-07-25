import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import options from "../assets/ski_resorts_japan.json";
import { InputAdornment } from "@mui/material";

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

  return (
    <div>
      <Autocomplete
        multiple
        options={filteredOptions}
        sx={{ width: 500 }}
        getOptionLabel={(option) => (option && option.name) || ""}
        value={selectedOptions}
        onInputChange={(event, newInputValue) => {}}
        onChange={(event, newValues) => {
          if (newValues) {
            const newIDs = newValues.map((value) => value.skiID);
            setSearchInput(newIDs);
            setSkiTargetID(newIDs);
          } else {
            setSearchInput([]);
            setSkiTargetID([]);
          }
        }}
        renderInput={(params) => (
          <div style={{ display: "flex", alignItems: "center" }}>
            <TextField
              {...params}
              label="Search Ski Resorts"
              variant="standard"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {params.InputProps.endAdornment}
                    <InputAdornment position="end">
                      <IconButton onClick={handleSearchClick}>
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  </>
                ),
              }}
            />
          </div>
        )}
      />
    </div>
  );
};

export default Search;
