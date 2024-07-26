import { useState } from "react";
import prefData from "../assets/prefectures.json";
import { Box, InputLabel, MenuItem, FormControl, Select } from "@mui/material";
const Filter = ({ filter, setFilter }) => {
    const SELECT_ALL_REGION_NAME = "全選択";
    const SELECT_ALL_PERIOD_NAME = "全期間"
    const months = ["11月", "12月", "1月", "2月", "3月", "4月"];
    const seasons = ["2023/24", "2022/23", "2021/22"];
    const [selectRegion, setSelectRegion] = useState(SELECT_ALL_REGION_NAME);
    const [selectSeason, setSelectSeason] = useState("2023/24");
    const [selectPeriod, setSelectPeriod] = useState(SELECT_ALL_PERIOD_NAME);
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                p: 5,
                m: 1,
                bgcolor: "background.paper",
                borderRadius: 1,
                gap: 2,
            }}
        >
            <FormControl sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="region-label">地域</InputLabel>
                <Select
                    labelId="region-label"
                    id="region"
                    value={selectRegion}
                    label="地域"
                    onChange={(e) => {
                        setSelectRegion(e.target.value);
                        setFilter({ ...filter, "pref": e.target.value !== SELECT_ALL_REGION_NAME ? e.target.value : "" });
                    }}
                >
                    <MenuItem key="none" value={SELECT_ALL_REGION_NAME}>{SELECT_ALL_REGION_NAME}</MenuItem>
                    {prefData.map(({ prefCode, name }, index) => {
                        return (
                            <MenuItem key={index} value={name}>{name}</MenuItem>
                        )
                    })}
                </Select>
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="season-label">シーズン</InputLabel>
                <Select
                    labelId="season-label"
                    id="season"
                    value={selectSeason}
                    label="シーズン"

                    onChange={(e) => {
                        setSelectSeason(e.target.value);
                        setFilter({ ...filter, "season": e.target.value });
                    }}
                >
                    {seasons.map((item, index) => {
                        return (
                            <MenuItem key={index} value={item}>{item + "年"}</MenuItem>
                        )
                    })}
                </Select>
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="period-label">期間</InputLabel>
                <Select
                    labelId="period-label"
                    id="period"
                    value={selectPeriod}
                    label="期間"
                    onChange={(e) => {
                        setSelectPeriod(e.target.value)
                        setFilter({ ...filter, "period": e.target.value !== SELECT_ALL_PERIOD_NAME ? e.target.value : "", });
                    }}
                >
                    <MenuItem key="all" value={SELECT_ALL_PERIOD_NAME}>{SELECT_ALL_PERIOD_NAME}</MenuItem>
                    {months.map((item, index) => {
                        return (
                            <MenuItem key={index} value={item}>{item}</MenuItem>
                        )
                    })}
                </Select>
            </FormControl>
        </Box>
    )
}

export default Filter;