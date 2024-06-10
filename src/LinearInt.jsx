import React, { useState } from "react";
import { useEffect } from "react";
import gridzahyou from "./assets/snowlev-2023020212.json";
import skiPoint from "./assets/sukijou-zahyou.json";

// "region": "山形",
// "name": "蔵王温泉スキー場",
// "latitude": "38.17365796",
// "longitude": "140.4116476"

// "values": [
//   {
//       "message_number": 1,
//       "short_name": "snoag",
//       "data_value": 29.598958333333414
//   },
//   {
//       "message_number": 2,
//       "short_name": "unknown",
//       "data_value": 0.0
//   },

const LinearInt = () => {
  const grid = gridzahyou;

  const findPoints = (skiPoint, grid) => {
    const xSorted = grid.slice().sort((a, b) => a.latitude - b.latitude);
    const ySorted = grid.slice().sort((a, b) => a.longitude - b.longitude);

    let x0, x1, y0, y1;

    for (let i = 0; i < xSorted.length - 1; i++) {
      if (
        xSorted[i].latitude <= skiPoint.latitude &&
        xSorted[i + 1].latitude >= skiPoint.latitude
      ) {
        x0 = xSorted[i];
        x1 = xSorted[i + 1];
        break;
      }
    }

    for (let i = 0; i < ySorted.length - 1; i++) {
      if (
        ySorted[i].longitude <= skiPoint.longitude &&
        ySorted[i + 1].longitude >= skiPoint.longitude
      ) {
        y0 = ySorted[i];
        y1 = ySorted[i + 1];
        break;
      }
    }

    if (!x0 || !x1 || !y0 || !y1) {
      return [];
    }

    const skiInfo = {
      region: skiPoint.region,
      name: skiPoint.name,
      latitude: skiPoint.latitude,
      longitude: skiPoint.longitude,
    };

    const points = {
      ...skiInfo,
      surroundingPoints: [
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
      ],
    };

    if (points.surroundingPoints.includes(undefined)) {
      return {
        ...skiInfo,
        surroundingPoints: null,
      };
    } else {
      return points;
    }
  };

  //左下p00,右下p10,左上p01,右上p11
  const bilinearInt = (skiPoint) => {
    if (skiPoint.surroundingPoints !== null) {
      const x = skiPoint.latitude;
      const y = skiPoint.longitude;
      const [p00, p10, p01, p11] = skiPoint.surroundingPoints;

      const x0 = p00.latitude,
        y0 = p00.longitude;
      const x1 = p10.latitude,
        y1 = p11.longitude;
      var dataResult = [];
      for (let i = 0; i < p00.values.length; i++) {
        const f00 = p00.values[i].data_value;
        const f10 = p10.values[i].data_value;
        const f01 = p01.values[i].data_value;
        const f11 = p11.values[i].data_value;

        const result = {
          message_number: p00.values[i].message_number,
          short_name: p00.values[i].short_name,
          data_value:
            (f00 * (x1 - x) * (y1 - y) +
              f10 * (x - x0) * (y1 - y) +
              f01 * (x1 - x) * (y - y0) +
              f11 * (x - x0) * (y - y0)) /
            ((x1 - x0) * (y1 - y0)),
        };

        dataResult.push(result);
      }

      return {
        ...skiPoint,
        values: dataResult,
      };
    } else {
      return {
        ...skiPoint,
        values: null,
      };
    }
  };

  const dataMerge = () => {
    const bilinearedPoint = [];
    skiPoint.map((point, index) => {
      const surroundingPoints = findPoints(point, grid);
      const values = bilinearInt(surroundingPoints);
      bilinearedPoint.push(values);
    });
    //↓jsonファイル作成
    //makeJsonFile(bilinearedPoint);
  };

  const makeJsonFile = (data) => {
    useEffect(() => {
      const fileName = "calculatedData";
      const jsonData = data;

      const fileNameWithJson = `${fileName}.json`;
      const blobData = new Blob([JSON.stringify(jsonData)], {
        type: "application/json",
      });
      const jsonURL = URL.createObjectURL(blobData);

      const link = document.createElement("a");
      link.href = jsonURL;
      link.download = fileNameWithJson;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(jsonURL);
    }, []);
  };

  return <div>{dataMerge()}</div>;
};

export default LinearInt;
