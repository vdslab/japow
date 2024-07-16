import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import d3Tip from "d3-tip";
import JapanData from "./assets/Japan.json";
import zahyou from "../docker-python/data/anl_data-2023121612.json";
// import sukizahyou from "./assets/ski_resorts_japan.json";
const ZoomableSVG = (props) => {
  const { children } = props;

  const svgRef = useRef();
  const [k, setK] = useState(1);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const minZoom = 0.7;
  const maxZoom = 3;
  useEffect(() => {
    const zoom = d3
      .zoom()
      .scaleExtent([minZoom, maxZoom])
      .on("zoom", (event) => {
        const { x, y, k } = event.transform;
        setX(x);
        setY(y);
        setK(k);
      });
    d3.select(svgRef.current).call(zoom);
  }, []);
  return (
    <svg ref={svgRef} width={window.innerWidth / 2} height={window.innerHeight}>
      <g transform={`translate(${x + 150},${y})scale(${k - 0.5})`}>
        {children}
      </g>
    </svg>
  );
};

const MapDisplay = ({ skiTargetID, setSkiTargetID, mapData }) => {
  const svgRef = useRef(null);
  const width = 800;
  const height = 800;

  const tip = d3Tip()
    .attr("class", "d3-tip")
    .offset([-10, 0])
    .html((event, d) => {
      return `<strong>Name:</strong> <span style='color:black'>${d.name}</span><br>
            `;
    })
    .style("background", "white")
    .style("color", "black")
    .style("padding", "5px")
    .style("border", "1px solid black")
    .style("border-radius", "3px");
  var svg;

  useEffect(() => {
    const projection = d3
      .geoMercator()
      .center([137, 38]) // 日本の中心座標
      .scale(4000) // スケール調整
      .translate([0, height]);

    const path = d3.geoPath().projection(projection);

    svg = d3.select(svgRef.current).attr("width", width).attr("height", height);

    // 既存の要素を全て削除
    svg.selectAll("*").remove();

    svg
      .selectAll("path")
      .data(JapanData.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("fill", "#ccc")
      .attr("stroke", "#000");

    // 点を描画
    svg
      .append("g")
      .selectAll("circle")
      .data(zahyou)
      .enter()
      .append("circle")
      .attr("cx", (d) => {
        const coords = projection([d.longitude, d.latitude]);
        return coords ? coords[0] : null;
      })
      .attr("cy", (d) => {
        const coords = projection([d.longitude, d.latitude]);
        return coords ? coords[1] : null;
      })
      .attr("r", 2)
      .attr("fill", "red")
      .on("click", (event, d) => {
        // クリックイベントのハンドラ
        console.log("Clicked data:", d);
        // d3.select(event.currentTarget).attr("fill", "blue");
      });

    d3.select("svg").call(tip);
    svg
      .append("g")
      .selectAll("circle")
      .data(mapData)
      .enter()
      .append("circle")
      .attr("cx", (d) => {
        const coords = projection([d.longitude, d.latitude]);
        return coords ? coords[0] : null;
      })
      .attr("cy", (d) => {
        const coords = projection([d.longitude, d.latitude]);
        return coords ? coords[1] : null;
      })
      .attr("r", 3)
      .attr("fill", (d) => {
        return !skiTargetID
          ? "#00ffff"
          : skiTargetID === d.skiID
            ? "#00ffff"
            : "rgb(0,0,0)";
      })
      .on("mouseenter", tip.show)
      .on("mouseout", tip.hide)
      .on("click", (event, d) => {
        tip.hide();
        console.log("Cliked skijou-data;", d);
        tip.hide();
        setSkiTargetID(d.skiID);
      });

    //console.log(skiTargetID);
  }, [skiTargetID, mapData]);
  console.log(skiTargetID);
  return (
    <ZoomableSVG>
      <svg ref={svgRef} viewBox={`0 0 ${width / 2} ${height * 2}`}></svg>
    </ZoomableSVG>
  );
};

export default MapDisplay;
