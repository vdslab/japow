import React from "react";
import { useEffect, useState } from "react";
import { ResponsiveBump } from "@nivo/bump";
import skiData from "./assets/snowQualityMap.json";
import { sort } from "./SortData.js";
import { rank } from "./MakeRank.js";
import CustomTooltip from "./CustomTooltip";
// const data = [
//   {
//     id: "japan",
//     data: [
//       { x: "plane", y: 270 },
//       { x: "helicopter", y: 290 },
//       { x: "boat", y: 300 },
//     ],
//   },
//   {
//     id: "france",
//     data: [
//       { x: "plane", y: 320 },
//       { x: "helicopter", y: 280 },
//       { x: "boat", y: 260 },
//     ],
//   },
// ];

// console.log(sort(skiData));

const BumpChart = ({ skiTarget, setSkiTarget }) => {
  const scoreSortedData = rank(sort(skiData));
  const [bumpData, setBumpData] = useState([]);
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

    //console.log(transformData(scoreSortedData));
    setBumpData(transformData(scoreSortedData));
  }, []);

  const a = bumpData.filter(
    (item) => item.id !== "草スキー場" && item.id !== "スノーパーク"
  );
  //console.log(bumpData.slice(0, 100));

  //  <div
  //     style={{
  //       background: "#ffffff",
  //       padding: "10px",
  //       border: "1px solid #ccc",
  //     }}
  //   >
  //     <strong>{serie.id}</strong>
  //     <br />
  //     Week: {point.data.x}
  //     <br />
  //     Score: {point.data.y}
  //   </div>

  return (
    <div style={{ height: 1500 }}>
      <ResponsiveBump
        data={a.slice(0, 50)}
        height={1000}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
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
        pointSize={10}
        pointColor={{ theme: "background" }}
        pointBorderWidth={2}
        pointBorderColor={{ from: "serieColor" }}
        pointLabelYOffset={-12}
        useMesh={false}
        onClick={(event) => {
          setSkiTarget(
            event.serie.data.id === skiTarget ? null : event.serie.data.id
          );
        }}
        tooltip={(point) => <CustomTooltip {...point} />}
        // legends={[
        //   {
        //     anchor: "bottom-right",
        //     direction: "column",
        //     justify: false,
        //     translateX: 100,
        //     translateY: 0,
        //     itemsSpacing: 0,
        //     itemDirection: "left-to-right",
        //     itemWidth: 80,
        //     itemHeight: 20,
        //     itemOpacity: 0.75,
        //     symbolSize: 12,
        //     symbolShape: "circle",
        //     symbolBorderColor: "rgba(0, 0, 0, .5)",
        //     effects: [
        //       {
        //         on: "hover",
        //         style: {
        //           itemBackground: "rgba(0, 0, 0, .03)",
        //           itemOpacity: 1,
        //         },
        //       },
        //     ],
        //   },
        // ]}
      />
    </div>
  );
};

export default BumpChart;
