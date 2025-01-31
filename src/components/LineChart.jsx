import React, { useState } from "react";
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
import * as d3 from "d3";

const LineChart = ({ skiTargetID, skiData, skiColors, sqTarget }) => {
  const [hoveredLine, setHoveredLine] = useState(null);

  const renderTick = (tickProps) => {
    const { x, y, payload, index, allTicks } = tickProps;
    const lines = payload.value.split("/");
    const prevMonth =
      index > 0 && allTicks && allTicks[index - 1]
        ? allTicks[index - 1].name.split("/")[0]
        : null;

    return (
      <g transform={`translate(${x},${y})`}>
        {lines[0] && prevMonth !== lines[0] && (
          <line x1={0} y1={-8} x2={0} y2={0} stroke="#666" strokeWidth={1} />
        )}
        <text x={0} y={0} textAnchor="middle" fill="#666" fontSize={10}>
          {lines[0] && prevMonth !== lines[0] && (
            <tspan x={0} dy={13}>
              {lines[0]}
            </tspan>
          )}
        </text>
      </g>
    );
  };

  const renderCustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const displayCount = Math.min(payload.length, 5);
      const sortedPayload = payload
        .sort((a, b) => b.value - a.value)
        .slice(0, displayCount);
      const fontSize = 10;
      const tooltipStyle = {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        border: "1px solid #ccc",
        padding: "5px",
        fontSize: `${fontSize}px`,
        lineHeight: "1.2em",
      };

      return (
        <div className="custom-tooltip" style={tooltipStyle}>
          <p className="label" style={{ fontSize: `${fontSize}px` }}>
            {`${payload[0].payload.name.replace("/", " ")}`}
          </p>
          {sortedPayload.map((entry, index) => (
            <p
              key={`item-${index}`}
              style={{ color: entry.color, fontSize: `${fontSize}px` }}
            >
              {`${entry.name} : ${Math.round(entry.value)} %`}
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
    const colorScheme = d3.schemeCategory10; // D3のカラー配列
    const pastData = snowFilterBySkiTarget(skiTargetID, skiData).map((item) => {
      item.values.sort((a, b) => a.name.localeCompare(b.name));

      let newItem = { name: item.name };
      item.values.forEach((skiResort) => {
        newItem[skiResort.name] = skiResort[sqTarget];
        if (skiTargetNames.every(({ skiID }) => skiID !== skiResort.skiID)) {
          skiTargetNames.push({ name: skiResort.name, skiID: skiResort.skiID });
        }
      });

      return newItem;
    });

    return (
      // ResponsiveContainerを親タグで囲んで、親タグでサイズを指定する
      <div style={{width:"100%", height:"90%"}}>
        <ResponsiveContainer width={"100%"} height={"100%"}>
          <LineC
            data={pastData}
            width={"100%"}
            margin={{ top: 5, right: 20, left: -20, bottom: 17 }}
          >
            <CartesianGrid vertical={false} horizontal={true} />
            <XAxis
              dataKey="name"
              interval={0}
              tick={(tickProps) =>
                renderTick({ ...tickProps, allTicks: pastData })
              }
              tickLine={false}
            />
            <YAxis tick={{ style: { fontSize: "12px", fill: "#666" } }} />
            <Tooltip content={renderCustomTooltip} />
            <Legend
              wrapperStyle={{ height: "10%", fontSize: `${legendFontSize}px` }}
            />
            {skiTargetNames.map(({ name, skiID }) => (
              <Line
                key={name}
                type="monotone"
                dataKey={name}
                stroke={skiColors[skiID]}
                name={name}
                strokeOpacity={hoveredLine && hoveredLine !== name ? 0.2 : 1}
                strokeWidth={hoveredLine === name ? 2 : 1}
                dot={{
                  r: hoveredLine === name ? 1 : 1,
                  onMouseEnter: () => setHoveredLine(name),
                  onMouseLeave: () => setHoveredLine(null),
                }}
                activeDot={{
                  r: 2,
                  onMouseEnter: () => setHoveredLine(name),
                  onMouseLeave: () => setHoveredLine(null),
                }}
                onMouseEnter={() => setHoveredLine(name)}
                onMouseLeave={() => setHoveredLine(null)}
              />
            ))}
          </LineC>
        </ResponsiveContainer>
      </div>
    );
  } else {
    return (
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
        スキー場を選択してください
      </div>
    );
  }
};

export default LineChart;
