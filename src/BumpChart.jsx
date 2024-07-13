import React, { useEffect, useState } from "react";
import { ResponsiveBump } from "@nivo/bump";
import { sort } from "./SortData.js";
import { rank } from "./MakeRank.js";
import { avgRank } from "./AverageRank";

const CustomTooltip = ({ serie, point }) => {
  return (
    <div
      style={{
        background: "white",
        padding: "9px 12px",
        border: "1px solid #ccc",
      }}
    >
      <strong>{point.serie.id}</strong>
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

const BumpChart = ({ skiTarget, setSkiTarget, skiData }) => {
  const [bumpData, setBumpData] = useState([]);
  const [highlightedLine, setHighlightedLine] = useState(null);
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
  }, [skiData]);

  // console.log(skiTarget);

  const handleLineClick = (serie) => {
    setHighlightedLine(serie.id === highlightedLine ? null : serie.id);
  };
  return (
    <div style={{ height: "80vh", width: "100%", overflow: "auto" }}>
      <div style={{ height: 1500 }}>
        <ResponsiveBump
          data={bumpData}
          height={1500}
          width={1100}
          xPadding={0.8}
          xOuterPadding={0}
          yOuterPadding={0}
          margin={{ top: 50, right: 200, bottom: 50, left: 60 }}
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
          pointSize={5}
          activePointSize={6}
          inactivePointSize={2}
          pointColor={{ from: "serie.color", modifiers: [] }}
          activePointBorderWidth={2}
          isInteractive={true} //インタラクションを行うかどうか
          useMesh={true} //点をアバウトに判定してくれる
          // lineWidth={(serie) => {
          //   //console.log(serie);
          //   highlightedLine ? (serie.id === highlightedLine ? 4 : 0.2) : 2;
          // }}

          activeLineWidth={(serie) => {
            console.log(serie);
            serie.id === highlightedLine ? 4 : 2;
          }}
          // inactiveOpacity={0.2}
          // onClick={(event) => handleLineClick(event.serie)}

          lineWidth={3}
          inactiveLineWidth={2}
          // activeLineWidth={5}
          inactiveOpacity={0.1}
          onClick={(event) => {
            console.log(event);
            setSkiTarget(
              event.serie.data.id === skiTarget ? null : event.serie.data.id
            );
          }}
          pointTooltip={CustomTooltip}
          //lineTooltip={CustomTooltip}
          animate={true}
        />
      </div>
    </div>
  );
};

export default BumpChart;
