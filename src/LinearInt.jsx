import React, { useState } from "react";
import { useEffect } from "react";
import skiPoint from "./assets/sukijou-zahyou.json";
import gridzahyou from "../docker-python/data/snowlev-2023020212.json";

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
    // console.log(ySorted);
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

    const points = {
      region: skiPoint.region,
      name: skiPoint.name,
      latitude: skiPoint.latitude,
      longitude: skiPoint.longitude,
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
      const R = Math.PI / 180;
      function distance(lat1, lng1, lat2, lng2) {
        lat1 *= R;
        lng1 *= R;
        lat2 *= R;
        lng2 *= R;
        return (
          6371 *
          Math.acos(
            Math.cos(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1) +
              Math.sin(lat1) * Math.sin(lat2)
          )
        );
      }

      var firstNear, firstIndex;
      var secondNear, secondIndex;

      var firstResult;
      for (let i = 0; i < xSorted.length - 1; i++) {
        var result = distance(
          xSorted[i].latitude,
          xSorted[i].longitude,
          skiPoint.latitude,
          skiPoint.longitude
        );
        if (i === 0) {
          firstResult = result;
          firstIndex = i;
          firstNear = [
            xSorted[firstIndex].latitude,
            xSorted[firstIndex].longitude,
          ];
        }
        if (result < firstResult) {
          firstResult = result;
          secondIndex = firstIndex;
          firstIndex = i;
          secondNear = firstNear;
          firstNear = [
            xSorted[firstIndex].latitude,
            xSorted[firstIndex].longitude,
          ];
        }
      }

      points.surroundingPoints = [xSorted[firstIndex], xSorted[secondIndex]];
      // console.log(points);
    }
    return points;
  };

  //左下p00,右下p10,左上p01,右上p11
  const bilinearInt = (skiPoint) => {
    const x = skiPoint.latitude;
    const y = skiPoint.longitude;
    var dataResult = [];
    if (skiPoint.surroundingPoints.length === 4) {
      //周りの四点で線形補間
      const [p00, p10, p01, p11] = skiPoint.surroundingPoints;

      const x0 = p00.latitude,
        y0 = p00.longitude;
      const x1 = p10.latitude,
        y1 = p11.longitude;

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
    } else if (skiPoint.surroundingPoints.length === 2) {
      //周りに四点なかった場合。二点で線形補間
      const [p0, p1] = skiPoint.surroundingPoints;
      for (let i = 0; i < p0.values.length; i++) {
        const f0 = p0.values[i].data_value;
        const f1 = p1.values[i].data_value;
        const result = {
          message_number: p1.values[i].message_number,
          short_name: p1.values[i].short_name,
          data_value:
            (f0 * (p1.latitude - x) + f1 * (x - p0.latitude)) /
            (p1.latitude - p0.latitude),
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
