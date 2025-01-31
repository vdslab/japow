import { useState } from "react";
import {
  Box,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Checkbox,
  ListItemText,
  Collapse,
  IconButton,
} from "@mui/material";
import { ExpandMore, ChevronRight } from "@mui/icons-material";
import { PERIOD_IDS, SNOW_QUALITY_LIST } from "../constants";

const Filter = ({ filter, setFilter, setSqTarget, sqTarget }) => {
  const SELECT_ALL_REGION_NAME = "全国";
  const periods = [
    { name: "全期間", id: PERIOD_IDS.all },
    { name: "序盤（11月）", id: PERIOD_IDS.early },
    { name: "中盤（12月〜2月）", id: PERIOD_IDS.middle },
    { name: "終盤（3月）", id: PERIOD_IDS.late },
  ];
  const SELECT_ALL_PERIOD_NAME = "全期間";
  const seasons = ["2023/24", "2022/23", "2021/22"];
  const [selectSeason, setSelectSeason] = useState("2023/24");
  const [selectPeriod, setSelectPeriod] = useState(filter.period);
  const [selectSq, setSelectSq] = useState(sqTarget);
  const [showHelp, setShowHelp] = useState(false);
  const [helpText, setHelpText] = useState("");
  const [expandedRegions, setExpandedRegions] = useState([]);

  const regions = {
    北海道: ["北海道"],
    東北: ["青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県"],
    関東: [
      "茨城県",
      "栃木県",
      "群馬県",
      "埼玉県",
      "千葉県",
      "東京都",
      "神奈川県",
    ],
    甲信越: ["新潟県", "山梨県", "長野県", "静岡県"],
    北陸: ["石川県", "富山県", "福井県"],
    中京: ["岐阜県", "愛知県", "三重県"],
    関西: ["滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県"],
    中国: ["鳥取県", "島根県", "岡山県", "広島県", "山口県"],
    四国: ["徳島県", "香川県", "愛媛県", "高知県"],
    九州: [
      "福岡県",
      "佐賀県",
      "長崎県",
      "熊本県",
      "大分県",
      "宮崎県",
      "鹿児島県",
      "沖縄県",
    ],
  };
  const allPrefectures = Object.values(regions).flat();
  const [selectRegion, setSelectRegion] = useState(allPrefectures);

  const handleRegionGroupChange = (region) => {
    const regionPrefs = regions[region];
    const isAllSelected = regionPrefs.every((pref) =>
      selectRegion.includes(pref)
    );

    const newSelection = isAllSelected
      ? selectRegion.filter((pref) => !regionPrefs.includes(pref))
      : [
          ...selectRegion,
          ...regionPrefs.filter((pref) => !selectRegion.includes(pref)),
        ];

    setSelectRegion(newSelection);
    setFilter({ ...filter, pref: newSelection });
  };

  const toggleRegionExpand = (region) => {
    setExpandedRegions((prev) =>
      prev.includes(region)
        ? prev.filter((r) => r !== region)
        : [...prev, region]
    );
  };
  const handlePrefectureChange = (pref) => {
    const newSelection = selectRegion.includes(pref)
      ? selectRegion.filter((item) => item !== pref)
      : [...selectRegion, pref];

    setSelectRegion(newSelection);
    setFilter({ ...filter, pref: newSelection });
  };

  const handleSelectAllRegions = () => {
    const isAllSelected = selectRegion.length === allPrefectures.length;
    setSelectRegion(isAllSelected ? [] : allPrefectures);
    setFilter({ ...filter, pref: isAllSelected ? [] : allPrefectures });
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
      }}
    >
      {/* 地域選択 */}
      <FormControl
        sx={{
          flex: "1 1 40%",
          minWidth: "200px",
        }}
      >
        <InputLabel id="region-label">地域</InputLabel>
        <Select
          labelId="region-label"
          id="region"
          multiple
          label="地域"
          value={selectRegion}
          renderValue={(selected) =>
            selected.length === allPrefectures.length
              ? SELECT_ALL_REGION_NAME
              : `${selected.length}県選択中`
          }
          MenuProps={{
            PaperProps: {
              style: {
                m: 2,
                maxHeight: "50%",
                width: "15%",
              },
            },
          }}
        >
          {/* 全国選択オプション */}
          <MenuItem onClick={handleSelectAllRegions}>
            <Checkbox checked={selectRegion.length === allPrefectures.length} />
            <ListItemText primary={SELECT_ALL_REGION_NAME} />
          </MenuItem>

          {/* 地域リスト表示 */}
          {Object.keys(regions).map((region) => (
            <div key={region}>
              <MenuItem>
                <Checkbox
                  checked={regions[region].every((pref) =>
                    selectRegion.includes(pref)
                  )}
                  indeterminate={
                    regions[region].some((pref) =>
                      selectRegion.includes(pref)
                    ) &&
                    !regions[region].every((pref) =>
                      selectRegion.includes(pref)
                    )
                  }
                  onClick={() => handleRegionGroupChange(region)}
                />
                <ListItemText primary={region} />
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleRegionExpand(region);
                  }}
                >
                  {expandedRegions.includes(region) ? (
                    <ExpandMore />
                  ) : (
                    <ChevronRight />
                  )}
                </IconButton>
              </MenuItem>
              <Collapse in={expandedRegions.includes(region)} timeout="auto">
                <Box sx={{ pl: 4 }}>
                  {regions[region].map((pref) => (
                    <MenuItem
                      key={pref}
                      onClick={() => handlePrefectureChange(pref)}
                    >
                      <Checkbox checked={selectRegion.includes(pref)} />
                      <ListItemText primary={pref} />
                    </MenuItem>
                  ))}
                </Box>
              </Collapse>
            </div>
          ))}
        </Select>
      </FormControl>

      {/* 期間選択 */}
      <FormControl sx={{ flex: "1 1 30%", minWidth: "150px" }}>
        <InputLabel id="period-label">時期</InputLabel>
        <Select
          labelId="period-label"
          id="period"
          value={selectPeriod}
          label="期間"
          onChange={(e) => {
            setSelectPeriod(e.target.value);
            setFilter({ ...filter, period: e.target.value });
          }}
        >
          {periods.map((item, index) => {
            return (
              <MenuItem key={index} value={item.id}>
                {item.name}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>

      {/* 雪質の選択 */}
      <Box sx={{ flex: "1 1 30%", position: "relative", minWidth: "150px" }}>
        <FormControl sx={{ width: "100%", height: "100%" }}>
          <InputLabel id="sq-label">雪質</InputLabel>
          <Select
            labelId="sq-label"
            id="sq"
            value={selectSq}
            label="雪質"
            onChange={(e) => {
              setSelectSq(e.target.value);
              setSqTarget(e.target.value);
            }}
            onOpen={() => setShowHelp(true)} // プルダウンが開かれたとき
            onClose={() => setShowHelp(false)} // プルダウンが閉じられたとき
          >
            {Object.keys(SNOW_QUALITY_LIST).map((item, index) => (
              <MenuItem key={index} value={item}>
                {SNOW_QUALITY_LIST[item]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* 雪質説明文 */}
        {showHelp && (
          <Box
            sx={{
              position: "absolute",
              top: 70, // プルダウンの上辺に揃える
              left: "calc(100% + 16px)", // プルダウン右横に配置
              width: "550px", // 説明文の幅を固定
              p: 2,
              border: "1px solid #ccc",
              borderRadius: "4px",
              backgroundColor: "#f9f9f9",
              fontSize: "13px",
              color: "#333",
              zIndex: 10, // 他要素より前面に表示
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // 見た目を改善
              overflowY: "auto", // 長すぎた場合にスクロール可能に
              maxHeight: "800px", // 高さ制限を設定
            }}
          >
            {Object.keys(SNOW_QUALITY_LIST).map((key) => (
              <Box key={key} sx={{ mb: 2 }}>
                <strong>{SNOW_QUALITY_LIST[key]}:</strong>{" "}
                {key === "powder" ? (
                  <>
                    水分量が非常に少なく、降ったばかりのふわふわでサラサラな雪を指します。
                    <br />
                    滑走時に軽快な感触が楽しめます。
                  </>
                ) : key === "dry" ? (
                  <>
                    水分量が少なく、さらさらした雪を指します。
                    <br />
                    滑走時にスピードが出やすく、カーブもしやすい特徴があります。
                  </>
                ) : key === "new" ? (
                  <>
                    新しく降り積もった雪を指します。
                    <br />
                    浮遊感を味わえますが、滑走にはやや難しく、初心者には扱いづらい場合もあります。
                  </>
                ) : key === "wet" ? (
                  <>
                    乾雪に比べて水分を多く含んでいる雪を指します。
                    <br />
                    スピードが出にくいですが、安定感があります。
                  </>
                ) : key === "shaba" ? (
                  <>
                    水分量がかなり多く、べっとりとした雪を指します。
                    <br />
                    スピードが出にくいため、低速での練習に適しています。
                  </>
                ) : (
                  <>
                    凍って硬くなった状態の雪を指します。
                    <br />
                    スピードが出やすいですが、カーブがしづらく、エッジをしっかり効かせる技術が必要です。
                    <br />
                    エッジングの練習に適しています。
                  </>
                )}
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Filter;
