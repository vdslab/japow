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
  const width = 600;
  const height = 250;

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
      <div style={{ overflow: "auto" }}>
        <BarC width={width} height={height} data={pastData}>
          <XAxis dataKey="name" interval={0} />

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
