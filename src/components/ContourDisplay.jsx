import React, { useEffect } from "react";
import * as d3 from "d3";
import geoJson from "../assets/Japan.json";
import volcanoData from "../assets/volcano.json";
import prefData from "../assets/prefectures.json";
import snowData from "./assets/snowlev-2023020212.json";

export const ContourDisplay = () => {
  const n = volcanoData.width;
  const m = volcanoData.height;
  const width = 928;
  const height = Math.round(m / n * width);
  const path = d3.geoPath().projection(d3.geoIdentity().scale(width / n));
  const color = d3.scaleSequential(d3.interpolateTurbo).domain(d3.extent(volcanoData.values)).nice();
  const contours = d3.contours().size([n, m]);


  // const projectionJapan = d3.geoMercator()
  //   .center([137, 38]) // 日本の中心座標
  //   .scale(1000)       // スケール調整
  //   .translate([width / 2, height / 2]);
  // const pathJapan = d3.geoPath().projection(projectionJapan);

  const pathJapan = d3.geoPath().projection(d3.geoIdentity().scale(width / n / 3));
  // const pathJapan = d3.geoPath()
  //   .projection(
  //     d3.geoMercator()
  //       .center([width / 2, height / 2])
  //       .scale(100)
  //       .translate([width / 2, height / 2])
  //   );

  // console.log(volcanoData);
  // console.log(volcanoData.value)
  // console.log(path(contours(volcanoData.values)[0]));
  // console.log(path(geoJson.features[0]));
  // console.log(path(geoJson.features[1].geometry));

  console.log(snowData);

  return (
    <div id="map-container" style={{ width: "100%", height: "400px" }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <g >

        </g>
      </svg>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <g stroke={"#0"} transform={`translate(0, ${height}) scale(1, -1)`}>
          <circle cx="0" cy="0" r="5" fill="red" />
          <g >
            {
              prefData.features.map((value, id) => {
                return (
                  <g stroke="#0">
                    {/* <path d={pathJapan(value.geometry)} fill="#ccc" stroke="#0" key={id} /> */}
                    <path d={pathJapan(value.geometry)} fill="#ccc" stroke="#0" key={id} />
                  </g>
                );
              })
            }
          </g>
        </g>
      </svg>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <g stroke={"#0"}>
          {
            contours(volcanoData.values).map((value, index) => {
              return (
                <path d={path(value)} fill="none" stroke={color(value.value)} key={index} />
              );
            })
          }
        </g>
      </svg>
    </div >
  );
};
