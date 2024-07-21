import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Bar,
  BarChart as BarC,
} from "recharts";
import { snowFilterBySkiTarget } from "../functions/filtering.js";

const BarChart = ({ skiTargetID, skiData }) => {
  const width = 600;
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
        {lines[1] && (
          <tspan x={x} dy={10}>
            {lines[1]}
          </tspan>
        )}
        {lines[0] && prevMonth !== lines[0] && (
          <tspan x={x} dy={13}>
            {lines[0]}
          </tspan>
        )}
      </text>
    );
  };
  if (skiData[0].monthValues.find((item) => item.skiID === skiTargetID)) {
    const pastData = snowFilterBySkiTarget(skiTargetID, skiData).map((item) => {
      let newItem = {};
      newItem.name = item.name;
      newItem.value = item.values[0].snowScore;
      return newItem;
    });
    // console.log(snowFilterBySkiTarget(skiTargetID, skiData))

    return (
      <div style={{ overflow: "auto" }}>
        <BarC
          width={width}
          height={height}
          data={pastData}
          barCategoryGap={20}
          margin={{ top: 5, right: 30, left: 5, bottom: 5 }}
        >
          <XAxis
            dataKey="name"
            interval={0}
            tick={(tickProps) =>
              renderTick({ ...tickProps, allTicks: pastData })
            }
          />

          <YAxis dataKey="value" />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" />
        </BarC>
      </div>
    );
  } else {
    return <div></div>;
  }
};

export default BarChart;
