import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import { sort } from "./SortData.js";
import { rank } from "./MakeRank.js";
import { avgRank } from "./AverageRank";

const NewBumpChart = ({ data, width = 1200, height = 3000 }) => {
  const transformData = (data) => {
    const transformed = [];
    data.forEach((month) => {
      month.weeks.forEach((week) => {
        week.values.forEach((value) => {
          if (!transformed[value.name]) {
            transformed[value.name] = [];
          }

          transformed[value.name].push({
            week: month.month + "/" + week.week,
            snowScore: value.rank,
          });
        });
      });
    });
    return transformed;
  };

  const getSkiResortData = (data, names) => {
    return names.reduce((acc, name) => {
      if (data[name]) {
        acc[name] = data[name];
      }
      return acc;
    }, {});
  };

  const svgRef = useRef();

  useEffect(() => {
    const scoreSortedData = rank(sort(data));
    const top50 = avgRank(scoreSortedData).slice(0, 50);
    const top50Names = top50.map((item) => item.name);
    const transformedData = getSkiResortData(
      transformData(scoreSortedData),
      top50Names
    );

    console.log(transformedData);
    console.log(top50Names);
    const svg = d3.select(svgRef.current);
    const width = 1000;
    const height = 2000;
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };

    svg.attr("viewBox", [0, 0, width, height]);

    const x = d3
      .scalePoint()
      .domain(transformedData[top50Names[0]].map((d) => d.week))
      .range([margin.left, width - margin.right]);

    const y = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(Object.values(transformedData).flat(), (d) => d.snowScore),
      ])
      .nice()
      .range([margin.top, height - margin.bottom]);

    const color = d3.scaleOrdinal(d3.schemePaired).domain(top50Names);

    const line = d3
      .line()
      .curve(d3.curveBumpX)
      .x((d) => x(d.week))
      .y((d) => y(d.snowScore));

    Object.keys(transformedData).forEach((name) => {
      const colorValue = color(name);
      svg
        .append("g")
        .append("path")
        .datum(transformedData[name])
        .attr("fill", "none")
        .attr("stroke", colorValue)
        .attr("stroke-width", 2)
        .attr("d", line);

      svg
        .append("g")
        .selectAll("circle")
        .data(transformedData[name])
        .enter()
        .append("circle")
        .attr("cx", (d) => x(d.week))
        .attr("cy", (d) => y(d.snowScore))
        .attr("r", 2)
        .attr("fill", colorValue);
    });

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
  }, [data]);

  return <svg ref={svgRef} width={width} height={height}></svg>;
};

export default NewBumpChart;
