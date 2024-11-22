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

const StackedBarChart = ({ snowData, sqTarget }) => {
  const filterAndSortData = (data, sqTarget) => {
    const targetDate = "2024/01/07";

    // 各月のデータを調べ、該当する日付のデータを取得
    const allDayValues = data.flatMap((month) =>
      month.days.flatMap((day) => day.dayValues)
    );

    // 指定日付のデータを抽出してソート
    const filteredData = allDayValues
      .filter((item) => item.date === targetDate)
      .sort((a, b) => b[sqTarget] - a[sqTarget]) // sqTarget で降順ソート
      .slice(0, 10); // 上位10件を取得

    return filteredData;
  };

  // データフィルタリングとソート
  const filteredData = filterAndSortData(snowData, sqTarget);

  // 積み上げ順序を定義
  const categories = ["powder", "dry", "wet", "shaba", "burn", "new"];
  const orderedCategories = [sqTarget, ...categories.filter((cat) => cat !== sqTarget)];

  return (
    <ResponsiveContainer width="100%" height={500}>
      <BarChart
        data={filteredData}
        layout="vertical"
        margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
      >
        <XAxis type="number" />
        <YAxis dataKey="name" type="category" />
        <Tooltip />
        <Legend />
        {orderedCategories.map((category) => (
          <Bar key={category} dataKey={category} stackId="a" fill={getCategoryColor(category)} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

// カテゴリーに応じた色を返す関数
const getCategoryColor = (category) => {
  const colors = {
    powder: "#8884d8",
    dry: "#83a6ed",
    wet: "#8dd1e1",
    shaba: "#82ca9d",
    burn: "#a4de6c",
    new: "#d0ed57",
  };
  return colors[category];
};

export default StackedBarChart;
