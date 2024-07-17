import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import d3Tip from "d3-tip";
import { sort } from "./SortData.js";
import { rank } from "./MakeRank.js";
import { avgRank } from "./AverageRank";

const NewBumpChart = ({ data, skiTargetID, setSkiTargetID }) => {
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
    // 週ごとにデータをわける
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

    // それに相対的なrankをつける
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
    }, []);

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

      // 右端に近い場合、左に表示
      if (clientX + tipWidth > innerWidth) {
        offsetX = -tipWidth - 10;
      }

      // 上端に近い場合、下に表示
      if (clientY - tipHeight < 0) {
        offsetY = 10;
      }

      return [offsetY, offsetX];
    });

  useEffect(() => {
    console.log(data);
    const scoreSortedData = rank(sort(data));
    console.log(scoreSortedData);
    const top50 = avgRank(scoreSortedData).slice(0, 50);
    const top50Names = top50.map((item) => item.name);

    const transformedData = getSkiResortData(
      transformData(scoreSortedData),
      top50Names
    );

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    const margin = { top: 10, right: 30, bottom: 80, left: 50 };
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
        0,
        d3.max(Object.values(transformedData).flat(), (d) => d.relativeRank),
      ])
      .nice()
      .range([margin.top, height - margin.bottom]);

    const color = d3.scaleOrdinal(d3.schemePaired).domain(top50Names);

    const line = d3
      .line()
      .curve(d3.curveBumpX)
      .x((d) => x(d.week))
      .y((d) => y(d.relativeRank));

    //縦線
    svg
      .append("g")
      .attr("class", "grid")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(
        d3
          .axisBottom(x)
          .tickSize(-height + margin.top + margin.bottom)
          .tickFormat("")
      )
      .selectAll("line")
      .style("stroke", "lightgray")
      .style("stroke-opacity", 0.7);

    d3.select("svg").call(tip);

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickSizeOuter(0))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    svg
      .append("text")
      .attr("class", "x label")
      .attr("text-anchor", "end")
      .attr("x", width / 2)
      .attr("y", height)
      .text("Week");
    svg
      .append("text")
      .attr("class", "y label")
      .attr("text-anchor", "end")
      .attr("x", -height / 2)
      .attr("y", 1)
      .attr("dy", ".75em")
      .attr("transform", "rotate(-90)")
      .text("Rank");
    Object.keys(transformedData).forEach((name, skiID) => {
      const colorValue = color(name);
      svg
        .append("g")
        .append("path")
        .datum(transformedData[name])
        .attr("fill", "none")
        .attr("stroke", colorValue)
        .attr(
          "stroke-width",
          !skiTargetID
            ? 2
            : skiTargetID === transformedData[name][0].skiID
            ? 4
            : 1
        )
        .style(
          "opacity",
          !skiTargetID
            ? 0.8
            : skiTargetID === transformedData[name][0].skiID
            ? 0.8
            : 0.3
        )
        .attr("d", line)
        .on("click", () => {
          tip.remove();
          setSkiTargetID(
            transformedData[name][0].skiID === skiTargetID
              ? null
              : transformedData[name][0].skiID
          );
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
        .style(
          "opacity",
          !skiTargetID
            ? 0.8
            : skiTargetID === transformedData[name][0].skiID
            ? 0.8
            : 0.3
        )
        .on("mouseenter", tip.show)
        .on("mouseout", tip.hide)
        .on("click", () => {
          tip.hide();
          console.log(transformedData[name], transformedData[name][0].skiID);
          setSkiTargetID(
            transformedData[name][0].skiID === skiTargetID
              ? null
              : transformedData[name][0].skiID
          );
        });
    });
  }, [data, skiTargetID]);

  console.log(skiTargetID);
  return (
    <div style={{ overflow: "auto" }}>
      <svg ref={svgRef} width={900} height={500}></svg>
    </div>
  );
};

export default NewBumpChart;
