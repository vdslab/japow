import React from "react";
import {
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  BarChart as BarC,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { snowFilterBySkiTarget } from "../functions/filtering.js";

const BarChart = ({ skiTargetID, skiData }) => {
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

    console.log(skiTargetID);
    return (
      <div width={`${skiTargetID.length * 100}%`} style={{ overflow: "auto" }}>
        <ResponsiveContainer width={"100%"} height={height}>
          <BarC
            data={pastData}
            barCategoryGap={20}
            margin={{ top: 5, right: 30, left: 5, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              interval={0}
              tick={(tickProps) =>
                renderTick({ ...tickProps, allTicks: pastData })
              }
            />
            <YAxis />
            <Tooltip />
            <Legend />
            {skiTargetNames.map((name, index) => (
              <Bar key={name} dataKey={name} fill={"#8884d8"} name={name} />
            ))}
          </BarC>
        </ResponsiveContainer>
      </div>
    );
  } else {
    return <div>No data available</div>;
  }
};

export default BarChart;
