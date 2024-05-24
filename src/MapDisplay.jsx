// import React, { useEffect } from "react";
// import * as d3 from "d3";
import JapanData from "./assets/prefectures.json";

// export const MapDisplay = () => {
//   console.log();
//   return (
//     <div id="map-container" style={{ width: "100%", height: "400px" }}></div>
//   );
// };

// src/Map.js
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
// import japanData from './japan.json'; // 日本のGeoJSONデータ

const MapDisplay = () => {
  const svgRef = useRef(null);

  useEffect(() => {
    const width = 800;
    const height = 600;

    const projection = d3.geoMercator()
      .center([137, 38]) // 日本の中心座標
      .scale(1000)       // スケール調整
      .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    svg.selectAll('path')
      .data(JapanData.features)
      .enter().append('path')
      .attr('d', path)
      .attr('fill', '#ccc')
      .attr('stroke', '#000');
  }, []);

  return (
    <svg ref={svgRef}></svg>
  );
};

export default MapDisplay;
