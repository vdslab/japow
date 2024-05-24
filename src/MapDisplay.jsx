import React, { useEffect } from "react";
import * as d3 from "d3";
import geoJson from "./assets/Japan.json";
import volcano from "./assets/volcano.json";


export const MapDisplay = () => {
  console.log(volcano);
  return (
    <div id="map-container" style={{ width: "100%", height: "400px" }}></div>
  );
};
