import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import JapanData from "./assets/Japan.json";

const ZoomableSVG = (props) => {
  const { children } = props;

  const svgRef = useRef();
  const [k, setK] = useState(1);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  useEffect(() => {
    const zoom = d3.zoom().on("zoom", (event) => {
      const { x, y, k } = event.transform;
      setX(x);
      setY(y);
      setK(k);
    });
    d3.select(svgRef.current).call(zoom);
  }, []);
  return (
    <svg ref={svgRef} width={window.innerWidth} height={window.innerHeight}>
      <g transform={`translate(${x + 300},${y + 200})scale(${k - 0.5})`}>
        {children}
      </g>
    </svg>
  );
};

const MapDisplay = () => {
  const svgRef = useRef(null);
  const width = 800;
  const height = 600;
  // const [tooltipContent, setTooltipContent] = useState("");
  var svg;

  useEffect(() => {
    const projection = d3
      .geoMercator()
      .center([137, 38]) // 日本の中心座標
      .scale(1000) // スケール調整
      .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    svg = d3.select(svgRef.current).attr("width", width).attr("height", height);

    svg
      .selectAll("path")
      .data(JapanData.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("fill", "#ccc")
      .attr("stroke", "#000");
  }, []);

  return (
    <>
      <ZoomableSVG>
        <svg ref={svgRef} viewBox={`0 0 ${width} ${height}`}></svg>
      </ZoomableSVG>
    </>
  );
};

export default MapDisplay;
