import React, { useEffect } from "react";
import * as d3 from "d3";
import geoJson from "./assets/Japan.json";
import volcanoData from "./assets/volcano.json";

export const ContourDisplay = () => {
  const n = volcanoData.width;
  const m = volcanoData.height;
  const width = 928;
  const height = Math.round(m / n * width);
  const path = d3.geoPath().projection(d3.geoIdentity().scale(width / n));
  const color = d3.scaleSequential(d3.interpolateTurbo).domain(d3.extent(volcanoData.values)).nice();
  const contours = d3.contours().size([n, m]);
  console.log(volcanoData);
  console.log(contours(volcanoData.values));

  return (
    <div id="map-container" style={{ width: "100%", height: "400px" }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <g stroke={"#0"}>
          {
            contours(volcanoData.values).map((value, index) => {
              return (
                <path d={path(value)} fill={color(value.value)} stroke="black" key={index} />
              );
            })
          }
        </g>
      </svg>
    </div >
  );
};
