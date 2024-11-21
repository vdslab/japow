import { useState } from "react";
import prefData from "../assets/prefectures.json";
import { Box, InputLabel, MenuItem, FormControl, Select } from "@mui/material";
const Filter = ({ filter, setFilter, setSqTarget, sqTarget}) => {
    const SELECT_ALL_REGION_NAME = "全国";
    const SELECT_ALL_PERIOD_NAME = "全期間"
    const months = ["11月", "12月", "1月", "2月", "3月"];
    const seasons = ["2023/24", "2022/23", "2021/22"];
    const sqList = ['powder', 'dry', 'wet', 'shaba', 'burn', 'new'];
    const [selectRegion, setSelectRegion] = useState(SELECT_ALL_REGION_NAME);
    const [selectSeason, setSelectSeason] = useState("2023/24");
    const [selectPeriod, setSelectPeriod] = useState(SELECT_ALL_PERIOD_NAME);
    const [selectSq, setSelectSq] = useState(sqTarget);
    const regions = {
        "北海道": ["北海道"],
        "東北": ["青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県"],
        "関東": ["茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県"],
        "甲信越": ["新潟県", "山梨県", "長野県"],
        "北陸": ["石川県", "富山県", "福井県"],
        "中京": ["岐阜県", "静岡県", "愛知県"],
        "関西": ["滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県"],
        "中国": ["鳥取県", "島根県", "岡山県", "広島県", "山口県"],
        "四国": ["徳島県", "香川県", "愛媛県", "高知県"],
        "九州・沖縄": ["福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"]
    };

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
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
                        setFilter({ ...filter, "pref": e.target.value !== SELECT_ALL_REGION_NAME ? regions[e.target.value] : [] });
                    }}
                >
                    <MenuItem key="none" value={SELECT_ALL_REGION_NAME}>{SELECT_ALL_REGION_NAME}</MenuItem>
                    {Object.keys(regions).map((region, index) => {
                        return (
                            <MenuItem key={index} value={region}>{region}</MenuItem>
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
            <FormControl sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="sq-label">雪質</InputLabel>
                <Select
                    labelId="sq-label"
                    id="sq"
                    value={selectSq}
                    label="シーズン"

                    onChange={(e) => {
                        setSelectSq(e.target.value);
                        setSqTarget(e.target.value);
                    }}
                >
                    {sqList.map((item, index) => {
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