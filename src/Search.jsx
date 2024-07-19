import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import { InputAdornment } from "@mui/material";

const Search = ({ options, skiTargetID, setSkiTargetID }) => {
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [searchInput, setSearchInput] = useState("");

  const handleSearchClick = () => {
    setSkiTargetID(searchInput);
  };

  return (
    <div>
      <Autocomplete
        options={filteredOptions}
        sx={{ width: 500 }}
        getOptionLabel={(option) => (option && option.name) || ""}
        onInputChange={(event, newInputValue) => {}}
        onChange={(event, newValue) => {
          if (newValue) {
            setSearchInput(newValue.skiID);
            setSkiTargetID(newValue.skiID);
          }
        }}
        renderInput={(params) => (
          <div style={{ display: "flex", alignItems: "center" }}>
            <TextField
              {...params}
              label="Search Ski Resorts"
              variant="outlined"
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
