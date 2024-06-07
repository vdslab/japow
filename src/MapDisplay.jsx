import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import JapanData from "./assets/Japan.json";
import zahyou from "./assets/snowlev-2023020212.json";
import sukizahyou from "./assets/sukijou-zahyou.json";

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
    <svg ref={svgRef} width={window.innerWidth} height={window.innerHeight}>
      <g transform={`translate(${x + 150},${y})scale(${k - 0.5})`}>
        {children}
      </g>
    </svg>
  );
};

const MapDisplay = () => {
  const svgRef = useRef(null);
  const width = 800;
  const height = 800;
  // const [tooltipContent, setTooltipContent] = useState("");
  var svg;

  useEffect(() => {
    const projection = d3
      .geoMercator()
      .center([137, 38]) // 日本の中心座標
      .scale(2000) // スケール調整
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
      .attr("r", 1)
      .attr("fill", "red")
      .on("click", (event, d) => {
        // クリックイベントのハンドラ
        console.log("Clicked data:", d);
        // d3.select(event.currentTarget).attr("fill", "blue");
      });

    // console.log(sukizahyou);
    svg
      .append("g")
      .selectAll("circle")
      .data(sukizahyou)
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
      .attr("r", 1.5)
      .attr("fill", "#00ffff")
      .on("click", (event, d) => {
        console.log("Cliked skijou-data;", d);
      });
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
