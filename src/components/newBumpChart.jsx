import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import d3Tip from "d3-tip";
import { avgRank } from "../functions/AverageRank";
import { sort } from "../functions/SortData";

const NewBumpChart = ({
  data,
  skiTargetID,
  setSkiTargetID,
  skiColors,
  setSkiColors,
}) => {
  const transformData = (data) => {
    const transformed = [];
    data.forEach((month) => {
      month.weeks.forEach((week) => {
        week.weekValues.forEach((value) => {
          if (!transformed[value.name]) {
            transformed[value.name] = [];
          }
          transformed[value.name].push({
            name: value.name,
            week: month.month + "/" + week.week,
            rank: value.rank,
            skiID: value.skiID,
          });
        });
      });
    });
    return transformed;
  };

  const getSkiResortData = (data, names) => {
    const weekData = names.reduce((acc, name) => {
      if (data[name]) {
        data[name].forEach((entry) => {
          if (!acc[entry.week]) {
            acc[entry.week] = [];
          }
          acc[entry.week].push(entry);
        });
      }
      return acc;
    }, []);

    Object.values(weekData).forEach((weekEntries) => {
      weekEntries.sort((a, b) => a.rank - b.rank);
      weekEntries.forEach((entry, index) => {
        entry.relativeRank = index + 1;
      });
    });
    const newData = names.reduce((acc, name) => {
      if (data[name]) {
        acc[name] = data[name];
      }
      return acc;
    }, {});

    return newData;
  };

  const svgRef = useRef();

  const tip = d3Tip()
    .attr("class", "d3-tip")
    .offset([-10, 0])
    .html((event, d) => {
      return `<strong>Name:</strong> <span style='color:black'>${d.name}</span><br>
              <strong>Week:</strong> <span style='color:black'>${d.week}</span><br>
              <strong>Rank:</strong> <span style='color:black'>${d.rank}</span><br>
              <strong>相対的なRank:</strong> <span style='color:black'>${d.relativeRank}</span>`;
    })
    .style("background", "white")
    .style("color", "black")
    .style("padding", "5px")
    .style("border", "1px solid black")
    .style("border-radius", "3px")
    .offset((event) => {
      const { clientX, clientY, view } = event;
      const { innerWidth, innerHeight } = view;

      const tipWidth = 200;
      const tipHeight = 100;
      let offsetX = 10;
      let offsetY = -10;

      if (clientX + tipWidth > innerWidth) {
        offsetX = -tipWidth - 10;
      }

      if (clientY - tipHeight < 0) {
        offsetY = 10;
      }

      return [offsetY, offsetX];
    });

  useEffect(() => {
    const scoreSortedData = data;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    if (scoreSortedData[0].weeks[0].weekValues.length.length === 0) {
      return;
    }

    const skiTargetName = [];
    scoreSortedData[0].weeks[0].weekValues.forEach((item) => {
      if (skiTargetID.includes(item.skiID)) {
        skiTargetName.push(item.name);
      }
    });

    const top50 = avgRank(scoreSortedData);
    const skiTargetData = top50.filter((item) =>
      skiTargetName.includes(item.name)
    );

    let displayedData = [...skiTargetData];
    if (skiTargetData.length < 50) {
      const remainingData = top50.filter(
        (item) => !skiTargetName.includes(item.name)
      );
      displayedData = [
        ...displayedData,
        ...remainingData.slice(0, 50 - skiTargetData.length),
      ];
    }

    skiTargetID.forEach((id) => {
      if (!displayedData.find((item) => item.skiID === id)) {
        const additionalItem = top50.find((item) => item.skiID === id);
        if (additionalItem) {
          displayedData.push(additionalItem);
          displayedData.sort((a, b) => a.avgRank - b.avgRank);
          if (displayedData.length > 50) {
            displayedData.pop();
          }
        }
      }
    });

    const sortedDisplayData = displayedData.sort(
      (a, b) => a.avgRank - b.avgRank
    );

    const top50Names = sortedDisplayData.map((item) => item.name);

    const transformedData = getSkiResortData(
      transformData(scoreSortedData),
      top50Names
    );

    const margin = { top: 20, right: 30, bottom: 100, left: 50 };
    const width = 900 - margin.right - margin.left;
    const height = 500 - margin.top - margin.bottom;
    svg.attr("viewBox", [0, 0, width, height]);

    const x = d3
      .scalePoint()
      .domain(transformedData[top50Names[0]].map((d) => d.week))
      .range([margin.left, width - margin.right]);

    const y = d3
      .scaleLinear()
      .domain([
        1,
        d3.max(Object.values(transformedData).flat(), (d) => d.relativeRank),
      ])
      .nice()
      .range([margin.top, height - margin.bottom]);

    const color = d3.scaleOrdinal(d3.schemePaired).domain(top50Names);

    const updatedSkiColors = { ...skiColors };

    top50Names.forEach((name) => {
      const skiName = transformedData[name][0].name;
      if (!updatedSkiColors[skiName]) {
        updatedSkiColors[skiName] = color(name);
      }
    });

    setSkiColors(updatedSkiColors);

    const line = d3
      .line()
      .curve(d3.curveBumpX)
      .x((d) => x(d.week))
      .y((d) => y(d.relativeRank));

    svg
      .append("g")
      .attr("class", "grid")
      .attr("transform", `translate(0,${height - margin.bottom + 10})`)
      .call(
        d3
          .axisBottom(x)
          .tickSize(-height + margin.top + margin.bottom - 15)
          .tickFormat("")
      )
      .selectAll("line")
      .style("stroke", "lightgray")
      .style("stroke-opacity", 0.7);

    d3.select("svg").call(tip);

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom + 10})`)
      .call(d3.axisBottom(x).tickSizeOuter(0))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    const maxRank = d3.max(
      Object.values(transformedData).flat(),
      (d) => d.relativeRank
    );
    const yTicks = [];
    const step = 5;

    if (maxRank >= 1) yTicks.push(1);

    for (let i = step; i <= maxRank; i += step) {
      yTicks.push(i);
    }

    if (yTicks[yTicks.length - 1] !== maxRank) {
      yTicks.push(maxRank);
    }

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(
        d3
          .axisLeft(y)
          .tickSizeOuter(0)
          .tickValues(yTicks)
          .tickFormat(d3.format("d"))
      );

    svg
      .append("text")
      .attr("class", "x label")
      .attr("text-anchor", "middle")
      .attr("x", width / 2)
      .attr("y", height)
      .text("Week");
    svg
      .append("text")
      .attr("class", "y label")
      .attr("text-anchor", "end")
      .attr("x", -height / 2 + 70)
      .attr("y", 1)
      .attr("dy", ".75em")
      .attr("transform", "rotate(-90)")
      .text("Rank");
    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("x", width / 2)
      .attr("y", -20)
      .style("font-size", "20px")
      .text("平均雪質ランキング");

    Object.keys(transformedData).forEach((name, skiID) => {
      const colorValue = updatedSkiColors[name];
      const isSelected = skiTargetID
        ? skiTargetID.includes(transformedData[name][0].skiID)
        : false;

      svg
        .append("g")
        .append("path")
        .datum(transformedData[name])
        .attr("fill", "none")
        .attr("stroke", colorValue)
        .attr("stroke-width", isSelected ? 4 : 2)
        .style("opacity", isSelected ? 0.8 : 0.3)
        .attr("d", line)
        .on("click", () => {
          tip.hide();
          const skiID = transformedData[name][0].skiID;
          const updatedSkiTargetID = isSelected
            ? skiTargetID.filter((id) => id !== skiID)
            : [...(skiTargetID || []), skiID];
          setSkiTargetID(updatedSkiTargetID);
        });

      svg
        .append("g")
        .selectAll("circle")
        .data(transformedData[name])
        .enter()
        .append("circle")
        .attr("cx", (d) => x(d.week))
        .attr("cy", (d) => y(d.relativeRank))
        .attr("r", 3)
        .attr("fill", colorValue)
        .style("opacity", isSelected ? 0.8 : 0.3)
        .on("mouseenter", tip.show)
        .on("mouseout", tip.hide)
        .on("click", () => {
          tip.hide();
          const skiID = transformedData[name][0].skiID;
          const updatedSkiTargetID = isSelected
            ? skiTargetID.filter((id) => id !== skiID)
            : [...(skiTargetID || []), skiID];
          setSkiTargetID(updatedSkiTargetID);
        });
    });

    return () => {
      tip.hide();
    };
  }, [data, skiTargetID]);

  if (data[0].weeks[0].weekValues.length === 0) {
    return <div>選択している県にはスキー場がありません</div>;
  }

  return (
    <div style={{ overflow: "auto" }}>
      <svg ref={svgRef} width={900} height={500}></svg>
    </div>
  );
};

export default NewBumpChart;
