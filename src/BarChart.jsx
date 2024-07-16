// データのもらい方はBumpChartをみならう
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
import { snowFilterBySkiTarget } from "./filtering.js";

const BarChart = ({ skiTargetID, skiData }) => {
  const width = 800;
  const height = 400;

  if (skiTargetID) {
    const pastData = snowFilterBySkiTarget(skiTargetID, skiData).map((item) => {
      let newItem = {};
      newItem.name = item.name;
      newItem.value = item.values[0].snowScore;
      return newItem;
    });
    console.log(pastData);
    // console.log(skiData);
    // console.log(snowFilterBySkiTarget(skiTargetID, skiData))

    return (
      <div>
        <BarC
          width={width}
          height={height}
          data={pastData}
          margin={{
            top: 5,
            bottom: 5,
            right: 5,
            left: 5
          }}
        >
          <XAxis dataKey="name" />
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
