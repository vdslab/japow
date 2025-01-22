import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import options from "../assets/ski_resorts_japan_open.json"
import { InputAdornment } from "@mui/material";
import Box from "@mui/material/Box";

const prefectureOrder = [
  "北海道",
  "青森県",
  "岩手県",
  "宮城県",
  "秋田県",
  "山形県",
  "福島県",
  "茨城県",
  "栃木県",
  "群馬県",
  "埼玉県",
  "千葉県",
  "東京都",
  "神奈川県",
  "新潟県",
  "富山県",
  "石川県",
  "福井県",
  "山梨県",
  "長野県",
  "岐阜県",
  "静岡県",
  "愛知県",
  "三重県",
  "滋賀県",
  "京都府",
  "大阪府",
  "兵庫県",
  "奈良県",
  "和歌山県",
  "鳥取県",
  "島根県",
  "岡山県",
  "広島県",
  "山口県",
  "徳島県",
  "香川県",
  "愛媛県",
  "高知県",
  "福岡県",
  "佐賀県",
  "長崎県",
  "熊本県",
  "大分県",
  "宮崎県",
  "鹿児島県",
  "沖縄県",
];

const Search = ({ skiTargetID, setSkiTargetID, setOpen }) => {
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [searchInput, setSearchInput] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);

  useEffect(() => {
    // 都道府県順でソート
    const sortedOptions = [...options].sort((a, b) => {
      const regionA = prefectureOrder.indexOf(a.region);
      const regionB = prefectureOrder.indexOf(b.region);
      return regionA - regionB;
    });
    setFilteredOptions(sortedOptions);

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
      if (newIDs.length > 10) {
        setOpen(true);
      } else {
        setSearchInput(newIDs);
        setSkiTargetID(newIDs);
      }
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
        renderOption={(props, option) => {
          return (
            <li {...props} key={props.key}>
              <Box>
                <div>{option.name}</div>
                <div style={{ fontSize: "0.8rem", color: "gray" }}>
                  {option.region}
                </div>
              </Box>
            </li>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            label="スキー場検索"
            InputProps={{
              ...params.InputProps,
              endAdornment: <>{params.InputProps.endAdornment}</>,
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
                transform: "translate(14px, 18px) scale(1)",
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
