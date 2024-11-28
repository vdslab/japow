import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { calcPeriodAverage } from "../functions/AverageRank";
import { snowFilterByPeriod } from "../functions/filtering";
import { SNOW_QUALITY_LIST } from "../constants";

const StackedBarChart = ({ snowData, sqTarget, filter }) => {
  const data = snowFilterByPeriod(snowData, filter.period);
  const filteredData = calcPeriodAverage(data)
    .sort((a, b) => b[sqTarget] - a[sqTarget]) // sqTarget で降順ソート
    .slice(0, 10); // 上位10件を取得
  // 積み上げ順序を定義
  const categories = Object.keys(SNOW_QUALITY_LIST);
  const orderedCategories = [
    sqTarget,
    ...categories.filter((cat) => cat !== sqTarget),
  ];

  return (
    <ResponsiveContainer width="100%" height="90%">
      <BarChart
        data={filteredData}
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
        <Tooltip />
        <Legend formatter={(value) => SNOW_QUALITY_LIST[value]} />
        {orderedCategories.map((category) => (
          <Bar
            key={category}
            dataKey={category}
            stackId="a"
            fill={getCategoryColor(category)}
          />
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
