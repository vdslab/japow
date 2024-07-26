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
} from "recharts";
import { snowFilterBySkiTarget } from "../functions/filtering.js";

const LineChart = ({ skiTargetID, skiData, skiColors }) => {
  const height = 300;

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
      const sortedPayload = payload.slice(0, displayCount);
      const fontSize = 14 - displayCount; // データポイントの数に応じてフォントサイズを調整
      return (
        <div className="custom-tooltip">
          <p className="label" style={{ fontSize: `${fontSize}px` }}>
            {`${payload[0].payload.name}`}
          </p>
          {sortedPayload.map((entry, index) => (
            <p
              key={`item-${index}`}
              style={{ color: entry.color, fontSize: `${fontSize}px` }}
            >
              {`${entry.name} : ${entry.value}`}
            </p>
          ))}
          {payload.length > 5 && (
            <p style={{ fontSize: `${fontSize}px` }}>...</p>
          )}
        </div>
      );
    }
    return null;
  };

  const legendFontSize = Math.max(10, 20 - skiTargetID.length); // 選択数に応じてフォントサイズを調整

  if (skiTargetID) {
    const skiTargetNames = [];
    const pastData = snowFilterBySkiTarget(skiTargetID, skiData).map((item) => {
      let newItem = { name: item.name };

      item.values.forEach((skiResort) => {
        newItem[skiResort.name] = skiResort.snowScore;
        if (!skiTargetNames.includes(skiResort.name)) {
          skiTargetNames.push(skiResort.name);
        }
      });

      return newItem;
    });

    return (
      <div width={`${skiTargetID.length * 100}%`} style={{ overflow: "auto" }}>
        <ResponsiveContainer width={"100%"} height={height}>
          <LineC
            data={pastData}
            margin={{ top: 5, right: 30, left: 5, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" fill="gray" />
            <XAxis
              dataKey="name"
              interval={0}
              tick={(tickProps) =>
                renderTick({ ...tickProps, allTicks: pastData })
              }
            />
            <YAxis />
            <Tooltip content={renderCustomTooltip} />
            <Legend wrapperStyle={{ fontSize: `${legendFontSize}px` }} />
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
      </div>
    );
  } else {
    return <div>No data available</div>;
  }
};

export default LineChart;
