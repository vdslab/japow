import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { calcPeriodAverage } from "../functions/AverageRank";
import { mapFilterBypref, snowFilterByPeriod, sqFilterByPeriod } from "../functions/filtering";
import { SNOW_QUALITY_LIST } from "../constants";
import { CreateSelecetAndSortData } from "../functions/SortData";
import sqData from "../assets/aaaa.json";

const StackedBarChart = ({
  // snowData,
  sqTarget,
  filter,
  skiTargetID,
  setSkiTargetID,
  setOpen,
}) => {
  // const data = snowFilterByPeriod(snowData, filter.period);
  // console.log(sqFilterByPeriod(sqData, filter.period))
  // const averageData = calcPeriodAverage(data);
  // console.log(averageData);
  let data = sqFilterByPeriod(sqData, filter.period);
  data = mapFilterBypref(data, filter.pref, skiTargetID);

  const displayData = CreateSelecetAndSortData(
    data,
    skiTargetID,
    sqTarget,
    10
  ).map((item) => {
    if (
      item.powder + item.new + item.dry + item.wet + item.shaba + item.burn >
      100
    ) {
      item.powder = Math.trunc(item.powder * 100) / 100;
    }
    return item;
  });
  // 積み上げ順序を定義
  const categories = Object.keys(SNOW_QUALITY_LIST);
  const orderedCategories = [
    sqTarget,
    ...categories.filter((cat) => cat !== sqTarget),
  ];
  const getOpacity = (entry) => {
    return skiTargetID.length > 0 || !skiTargetID.includes(entry.skiID)
      ? 0.6
      : 1;
  };
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: "white",
            padding: "5px",
            border: "1px solid #ccc",
            fontSize: "10px", // フォントサイズを小さく
            lineHeight: "1.2", // 行間を調整
          }}
        >
          <p>{`スキー場名: ${label}`}</p>
          {payload.map((data, index) => (
            <p key={index} style={{ color: data.color }}>
              {`${SNOW_QUALITY_LIST[data.dataKey]}: ${
                Math.trunc(data.value * 100) / 100
              } %`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return displayData.length > 0 ? (
    <ResponsiveContainer width="100%" height="90%">
      <BarChart
        data={displayData}
        layout="vertical"
        margin={{ top: 20, right: 30, left: 100 }}
      >
        <XAxis type="number" tickFormatter={(value) => `${value}%`} />
        <YAxis
          dataKey="name"
          type="category"
          tick={(props) => {
            const { x, y, payload } = props;
            const maxLineLength = 10; // 1行あたりの最大文字数
            const minLastLineLength = 3; // 最終行の最小文字数

            // 長いテキストを複数行に分割するzロジック
            let lines = [];
            if (
              (displayData[payload.index].rank + "位 " + payload.value).length >
              maxLineLength
            ) {
              let temp =
                displayData[payload.index].rank + "位 " + payload.value;
              while (temp.length > maxLineLength) {
                // 1行分を切り取る
                const line = temp.slice(0, maxLineLength);
                temp = temp.slice(maxLineLength);
                lines.push(line);
              }
              // 最後の行の長さが短すぎる場合、調整
              if (temp.length > 0) {
                if (temp.length < minLastLineLength && lines.length > 0) {
                  // 前の行を調整して最後の行を補完
                  lines[lines.length - 1] += temp;
                } else {
                  lines.push(temp);
                }
              }
            } else {
              lines = [displayData[payload.index].rank + "位 " + payload.value]; // 1行に収まる場合
            }

            return (
              <text
                x={x}
                y={y}
                fill="#666"
                textAnchor="end"
                fontSize={12}
                dominantBaseline="middle"
              >
                {lines.map((line, index) => (
                  <tspan
                    key={index}
                    x={x}
                    dy={index === 0 ? `-${(lines.length - 1) * 7.5}` : 15}
                  >
                    {line}
                  </tspan>
                ))}
              </text>
            );
          }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend formatter={(value) => SNOW_QUALITY_LIST[value]} />
        {orderedCategories.map((category) => (
          <Bar
            key={category}
            dataKey={category}
            stackId="a"
            fill={getCategoryColor(category)}
            barSize={80}
            cursor="pointer"
            onClick={(e) => {
              if (skiTargetID.includes(e.skiID)) {
                setSkiTargetID((prev) => prev.filter((id) => id !== e.skiID));
              } else {
                if (skiTargetID.length >= 10) {
                  setOpen(true);
                } else {
                  setSkiTargetID((prev) => [...prev, e.skiID]);
                }
              }
              // setSkiTargetID((prev) =>
              //   prev.includes(e.skiID)
              //     ? prev.filter((id) => id !== e.skiID)
              //     : [...prev, e.skiID]
              // );
            }}
          >
            {displayData.map((entry, index) => (
              <Cell
                key={`cell-${category}-${index}`}
                fill={getCategoryColor(category)}
                opacity={
                  skiTargetID.length === 0 || skiTargetID.includes(entry.skiID)
                    ? 1
                    : 0.6
                }
              />
            ))}
          </Bar>
        ))}
      </BarChart>
    </ResponsiveContainer>
  ) : (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "85%",
        fontSize: "16px",
        color: "#666",
      }}
    >
      選択された地域にスキー場はありません
    </div>
  );
};

// カテゴリーに応じた色を返す関数
const getCategoryColor = (category) => {
  const colors = {
    powder: "#54c3f1",
    new: "#49a2dc",
    dry: "#3e82c7",
    wet: "#3361b2",
    shaba: "#28419d",
    burn: "#1d2088",
    // powder: "#00A0E9",
    // new: "#0099D9",
    // dry: "#718CC7",
    // wet: "#796BAF",
    // shaba: "#4D4398",
    // burn: "#1D2088",
  };
  return colors[category];
};

export default StackedBarChart;
