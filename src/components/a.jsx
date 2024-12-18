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
  CheckBox,
} from "@mui/material";
import { ExpandMore, ChevronRight } from "@mui/icons-material";

const Filter = ({ filter, setFilter }) => {
  const SELECT_ALL_REGION_NAME = "全国";
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
    甲信越: ["新潟県", "山梨県", "長野県"],
    北陸: ["石川県", "富山県", "福井県"],
    中京: ["岐阜県", "静岡県", "愛知県"],
    関西: ["滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県"],
    中国: ["鳥取県", "島根県", "岡山県", "広島県", "山口県"],
    四国: ["徳島県", "香川県", "愛媛県", "高知県"],
    "九州・沖縄": [
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
  const [selectRegion, setSelectRegion] = useState([]);
  const [expandedRegions, setExpandedRegions] = useState([]);

  const handlePrefectureChange = (pref) => {
    const newSelection = selectRegion.includes(pref)
      ? selectRegion.filter((item) => item !== pref) // 選択解除
      : [...selectRegion, pref]; // 選択追加

    setSelectRegion(newSelection);
    setFilter({ ...filter, pref: newSelection });
  };

  const handleRegionGroupChange = (region) => {
    const regionPrefs = regions[region];
    const isAllSelected = regionPrefs.every((pref) =>
      selectRegion.includes(pref)
    );

    const newSelection = isAllSelected
      ? selectRegion.filter((pref) => !regionPrefs.includes(pref)) // 全解除
      : [
          ...selectRegion,
          ...regionPrefs.filter((pref) => !selectRegion.includes(pref)),
        ]; // 全選択

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

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <FormControl sx={{ m: 1, minWidth: 200 }}>
        <InputLabel id="region-label">地域</InputLabel>
        <Select
          labelId="region-label"
          id="region"
          multiple
          value={selectRegion}
          renderValue={(selected) =>
            selected.length === allPrefectures.length
              ? SELECT_ALL_REGION_NAME
              : `${selected.length}県選択中`
          }
          MenuProps={{
            PaperProps: {
              style: {
                m: 100,
                maxHeight: 600, // 最大表示高さを設定
                width: 300,
              },
            },
          }}
        >
          {/* 全国選択オプション */}
          <MenuItem onClick={() => setSelectRegion([])}>
            <Checkbox
              checked={selectRegion.length === allPrefectures.length}
              indeterminate={
                selectRegion.length > 0 &&
                selectRegion.length < allPrefectures.length
              }
            />
            <ListItemText primary={SELECT_ALL_REGION_NAME} />
          </MenuItem>

          {/* 地方リスト */}
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
    </Box>
  );
};

export default Filter;
