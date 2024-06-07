import React, { useState } from "react";
import gridzahyou from "./assets/snowlev-2023020212.json";
import sukizahyou from "./assets/sukijou-zahyou.json";

// "region": "山形",
// "name": "蔵王温泉スキー場",
// "latitude": "38.17365796",
// "longitude": "140.4116476"

const LinearInt = () => {
  //スキー場の点
  const [point, setPoint] = useState({
    latitude: 38.17365796,
    longitude: 140.4116476,
  });

  //仮データ 地図の点
  // const grid = [
  //   { x: 38.772087466948896, y: 140.25 },
  //   { x: 38.772087466948896, y: 140.625 },
  //   { x: 38.772087466948896, y: 141 },
  //   { x: 38.772087466948896, y: 141.375 },
  //   { x: 38.3974780173953, y: 141 },
  //   { x: 38.3974780173953, y: 140.625 },
  //   { x: 38.3974780173953, y: 140.25 },
  //   { x: 38.3974780173953, y: 139.875 },
  //   { x: 38.3974780173953, y: 139.5 },
  //   { x: 38.02286856441963, y: 139.5 },
  //   { x: 38.02286856441963, y: 139.875 },
  //   { x: 38.02286856441963, y: 140.625 },
  //   { x: 37.648259108102174, y: 140.625 },
  //   { x: 38.02286856441963, y: 140.25 },
  //   { x: 38.02286856441963, y: 140.625 },
  // ];

  const grid = gridzahyou;

  const findPoints = (point, grid) => {
    const xSorted = grid.slice().sort((a, b) => a.latitude - b.latitude);
    const ySorted = grid.slice().sort((a, b) => a.longitude - b.longitude);

    let x0, x1, y0, y1;

    for (let i = 0; i < xSorted.length - 1; i++) {
      if (
        xSorted[i].latitude <= point.latitude &&
        xSorted[i + 1].latitude >= point.latitude
      ) {
        x0 = xSorted[i];
        x1 = xSorted[i + 1];
        break;
      }
    }

    for (let i = 0; i < ySorted.length - 1; i++) {
      if (
        ySorted[i].longitude <= point.longitude &&
        ySorted[i + 1].longitude >= point.longitude
      ) {
        y0 = ySorted[i];
        y1 = ySorted[i + 1];
        break;
      }
    }

    if (!x0 || !x1 || !y0 || !y1) {
      return [];
    }

    const points = [
      grid.find(
        (p) => p.latitude === x0.latitude && p.longitude === y0.longitude
      ),
      grid.find(
        (p) => p.latitude === x1.latitude && p.longitude === y0.longitude
      ),
      grid.find(
        (p) => p.latitude === x0.latitude && p.longitude === y1.longitude
      ),
      grid.find(
        (p) => p.latitude === x1.latitude && p.longitude === y1.longitude
      ),
    ];
    return points;
  };

  //左下p00,右下p10,左上p01,右上p11
  const bilinearInt = (point, points) => {
    const [p00, p10, p01, p11] = points;

    const x0 = p00.latitude,
      y0 = p00.longitude;
    const x1 = p10.latitude,
      y1 = p11.longitude;

    const f00 = p00.values[0].data_value;
    const f10 = p10.values[0].data_value;
    const f01 = p01.values[0].data_value;
    const f11 = p11.values[0].data_value;

    const x = point.latitude;
    const y = point.longitude;

    const result =
      (f00 * (x1 - x) * (y1 - y) +
        f10 * (x - x0) * (y1 - y) +
        f01 * (x1 - x) * (y - y0) +
        f11 * (x - x0) * (y - y0)) /
      ((x1 - x0) * (y1 - y0));

    console.log(result);
    return result;
  };

  const surroundingPoints = findPoints(point, grid);
  const result = bilinearInt(point, surroundingPoints);

  console.log(findPoints(point, grid));
  console.log(result);

  return <div></div>;
};

export default LinearInt;
