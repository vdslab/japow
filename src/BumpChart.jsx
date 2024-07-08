import React, { useEffect, useState } from "react";
import { ResponsiveBump } from "@nivo/bump";
import skiData from "./assets/snowQualityMap.json";
import { sort } from "./SortData.js";
import { rank } from "./MakeRank.js";
import { avgRank } from "./AverageRank";

const CustomTooltip = ({ point }) => {
  // console.log("Point:", point);
  return (
    <div
      style={{
        background: "white",
        padding: "9px 12px",
        border: "1px solid #ccc",
      }}
    >
      <strong>{point.serie.data.id}</strong>
      <br />
      <span>Week: {point.data.x}</span>
      <br />
      <span>
        Ranking: {point.data.y}
        {" 位"}
      </span>
    </div>
  );
};

const BumpChart = ({ skiTarget, setSkiTarget }) => {
  const [bumpData, setBumpData] = useState([]);
  const scoreSortedData = rank(sort(skiData));
  const top50 = avgRank(scoreSortedData).slice(0, 50);
  const top50Names = top50.map((item) => item.name);

  const filterSkiResorts = (data, top50Names) => {
    return data.flatMap((monthData) => {
      return monthData.weeks.map((weekData) => {
        return {
          week: `${monthData.month} ${weekData.week}`,
          value: weekData.values.filter((skiResort) =>
            top50Names.includes(skiResort.name)
          ),
        };
      });
    });
  };

  const filteredSkiResorts = filterSkiResorts(scoreSortedData, top50Names);

  useEffect(() => {
    const transformData = (data) => {
      const transformedData = [];
      data.forEach((weekData) => {
        weekData.value.forEach((skiResort) => {
          const existingResort = transformedData.find(
            (resort) => resort.id === skiResort.name
          );
          const point = {
            x: weekData.week,
            y: skiResort.rank,
          };
          if (existingResort) {
            existingResort.data.push(point);
          } else {
            transformedData.push({ id: skiResort.name, data: [point] });
          }
        });
      });
      return transformedData;
    };

    setBumpData(transformData(filteredSkiResorts));
  }, []);

  return (
    <div style={{ height: 1500 }}>
      <ResponsiveBump
        data={bumpData}
        height={1000}
        width={1000}
        xPadding={0.9}
        xOuterPadding={0}
        yOuterPadding={0}
        margin={{ top: 50, right: 120, bottom: 50, left: 60 }}
        xScale={{ type: "point" }}
        yScale={{
          type: "linear",
          min: "auto",
          max: "auto",
          stacked: false,
          reverse: false,
        }}
        theme={{
          axis: {
            ticks: {
              text: {
                fontSize: 7,
                fill: "#333333",
                outlineWidth: 0,
                outlineColor: "transparent",
              },
            },
          },
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          orient: "bottom",
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "week",
          legendOffset: 36,
          legendPosition: "middle",
        }}
        axisLeft={{
          orient: "left",
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "ranking",
          legendOffset: -40,
          tickValues: 5,
          legendPosition: "middle",
        }}
        colors={{ scheme: "nivo" }}
        pointSize={6}
        activePointSize={6}
        inactivePointSize={0}
        pointColor={{ from: "serie.color", modifiers: [] }}
        activePointBorderWidth={2}
        useMesh={true}
        onClick={(event) => {
          setSkiTarget(event.serie.id === skiTarget ? null : event.serie.id);
        }}
        pointTooltip={CustomTooltip}
        animate={false}
      />
    </div>
  );
};

export default BumpChart;
