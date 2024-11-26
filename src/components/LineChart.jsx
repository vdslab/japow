import React from "react";
import {
  XAxis,
  YAxis,
  Tooltip,
  Line,
  LineChart as LineC,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from "recharts";
import { snowFilterBySkiTarget } from "../functions/filtering.js";

const LineChart = ({ skiTargetID, skiData, skiColors, sqTarget }) => {
  // x軸のカスタムメモリ
  const renderTick = (tickProps) => {
    const { x, y, payload, index, allTicks } = tickProps;

    const lines = payload.value.split("/");
    const prevMonth =
      index > 0 && allTicks && allTicks[index - 1]
        ? allTicks[index - 1].name.split("/")[0]
        : null;

    return (
      <text x={x} y={y} textAnchor="middle" fill="#666" fontSize={10}>
        {lines[0] && prevMonth !== lines[0] && (
          <tspan x={x} dy={13}>
            {lines[0]}
          </tspan>
        )}
      </text>
    );
  };

  const renderCustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const displayCount = Math.min(payload.length, 5);
      const sortedPayload = payload
        .sort((a, b) => b.value - a.value)
        .slice(0, displayCount);
      const fontSize = 10; // ツールチップのフォントサイズを小さく設定
      const tooltipStyle = {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        border: "1px solid #ccc",
        padding: "5px",
        fontSize: `${fontSize}px`,
        lineHeight: "1.2em",
      };

      console.log(payload[0]);
      return (
        <div className="custom-tooltip" style={tooltipStyle}>
          <p className="label" style={{ fontSize: `${fontSize}px` }}>
            {`${payload[0].payload.name}`}
          </p>
          {sortedPayload.map((entry, index) => (
            <p
              key={`item-${index}`}
              style={{ color: entry.color, fontSize: `${fontSize}px` }}
            >
              {`${entry.name} : ${Math.round(entry.value)}`}{" "}
              {/* ツールチップのスキー場名とvalue */}
            </p>
          ))}
          {payload.length > 5 && (
            <p style={{ fontSize: `${fontSize}px` }}>...more</p>
          )}
        </div>
      );
    }
    return null;
  };

  const legendFontSize = Math.max(10, 15 - skiTargetID.length);

  if (skiTargetID.length > 0) {
    const skiTargetNames = [];
    const pastData = snowFilterBySkiTarget(skiTargetID, skiData).map((item) => {
      let newItem = { name: item.name };
      item.values.forEach((skiResort) => {
        newItem[skiResort.name] = skiResort[sqTarget];
        if (!skiTargetNames.includes(skiResort.name)) {
          skiTargetNames.push(skiResort.name);
        }
      });

      return newItem;
    });
    return (
      <ResponsiveContainer width={"100%"} height={"100%"}>
        <LineC
          data={pastData}
          width={"100%"}
          margin={{ top: 5, right: 0, left: 0, bottom: 17 }}
        >
          <CartesianGrid vertical={false} horizontal={true} />
          <XAxis
            dataKey="name"
            interval={0}
            tick={(tickProps) =>
              renderTick({ ...tickProps, allTicks: pastData })
            }
            tickFormatter={(value) => {
              console.log(value.split("/"));
              const day = value.split("/")[1]; // 日付を抽出
              console.log(day);
              return day === "01日" ? value : ""; // 日付が01の時のみ表示
            }}
            tickLine={false} // X軸の目盛り線を非表示
          />

          <YAxis />
          <Tooltip content={renderCustomTooltip} />
          <Legend
            wrapperStyle={{ height: "10%", fontSize: `${legendFontSize}px` }}
          />

          {skiTargetNames.map((name) => (
            <Line
              key={name}
              type="monotone"
              dataKey={name}
              stroke={skiColors[name]}
              name={name}
            />
          ))}
        </LineC>
      </ResponsiveContainer>
    );
  } else {
    return <div>No data available</div>;
  }
};

export default LineChart;
