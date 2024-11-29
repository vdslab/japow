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
import { snowFilterByPeriod } from "../functions/filtering";
import { SNOW_QUALITY_LIST } from "../constants";
import { CreateSelecetAndSortData } from "../functions/SortData";

const StackedBarChart = ({
  snowData,
  sqTarget,
  filter,
  skiTargetID,
  setSkiTargetID,
}) => {
  const data = snowFilterByPeriod(snowData, filter.period);
  const averageData = calcPeriodAverage(data);
  const displayData = CreateSelecetAndSortData(
    averageData,
    skiTargetID,
    sqTarget,
    10
  );
  // 積み上げ順序を定義
  const categories = Object.keys(SNOW_QUALITY_LIST);
  const orderedCategories = [
    sqTarget,
    ...categories.filter((cat) => cat !== sqTarget),
  ];
  const getOpacity = (entry) => {
    console.log(entry);
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
              {`${SNOW_QUALITY_LIST[data.dataKey]}: ${Math.round(data.value * 100) / 100} %`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="90%">
      <BarChart
        data={displayData}
        layout="vertical"
        margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
      >
        <XAxis type="number" />
        <YAxis
          dataKey="name"
          type="category"
          tick={(props) => {
            const { x, y, payload } = props;
            const maxLineLength = 10; // 1行あたりの最大文字数
            const minSecondLineLength = 3; // 2行目の最小文字数

            // 長いテキストを2行に分割するロジック
            let lines = [];
            if (payload.value.length > maxLineLength) {
              const firstLine = payload.value.slice(0, maxLineLength);
              const secondLine = payload.value.slice(maxLineLength);

              // 2行目が短すぎる場合は最初の行を調整
              if (secondLine.length < minSecondLineLength) {
                lines = [
                  payload.value.slice(0, maxLineLength - minSecondLineLength),
                  payload.value.slice(maxLineLength - minSecondLineLength),
                ];
              } else {
                lines = [firstLine, secondLine];
              }
            } else {
              lines = [payload.value]; // 1行に収まる場合
            }

            return (
              <text x={x} y={y} fill="#666" textAnchor="end" fontSize={12}>
                {lines.map((line, index) => (
                  <tspan key={index} x={x} dy={index === 0 ? 0 : 15}>
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
            onClick={(e) => {
              setSkiTargetID((prev) =>
                prev.includes(e.skiID)
                  ? prev.filter((id) => id !== e.skiID)
                  : [...prev, e.skiID]
              );
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
  );
};

// カテゴリーに応じた色を返す関数
const getCategoryColor = (category) => {
  const colors = {
    powder: "#8884d8",
    new: "#83a6ed",
    dry: "#8dd1e1",
    wet: "#82ca9d",
    shaba: "#a4de6c",
    burn: "#d0ed57",
  };
  return colors[category];
};

export default StackedBarChart;
