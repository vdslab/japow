import prefData from "./assets/prefectures.json";
import { Box } from "@mui/material";
const Filter = ({ filter, setFilter }) => {
    const months = ["11月", "12月", "1月", "2月", "3月", "4月"];
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
            <div>
                <label htmlFor="pref">地域:</label>
                <select id="pref"
                    onChange={(e) => {
                        setFilter({ "pref": e.target.value, "period": filter.period, "sq": filter.sq });
                    }}
                >
                    <option key="none" value=""
                    >未選択</option>
                    {prefData.map(({ prefCode, name }, index) => {
                        return (
                            <option key={index} value={name}>{name}</option>
                        )
                    })}
                </select>
            </div>
            <div>
                <label htmlFor="period">期間:</label>
                <select id="period"
                    onChange={(e) => {
                        setFilter({ "pref": filter.pref, "period": e.target.value, "sq": filter.sq });
                    }}
                >
                    <option key="all" value="">全期間</option>
                    {months.map((item, index) => {
                        return (
                            <option key={index} value={item}>{item}</option>
                        )
                    })}
                </select>
            </div>
        </Box>
    )
}

export default Filter;