import { createRequire } from "module";
const require = createRequire(import.meta.url);
const fs = require("fs");
const skiPoint = require("../assets/ski_resorts_japan.json");
const path = require("path");
const fileNamePrefix = `calculatedData`;
const gridDirectory = "../../docker-python/data";

function getFilesFromDirectory(directory) {
  const files = fs.readdirSync(directory);
  return files.filter((file) => file.endsWith(".json"));
}

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

const findPoints = (skiPoint, grid, xSorted, ySorted, nearest) => {
  let x0, x1, y0, y1;
  if (nearest) {
    const points = {
      name: skiPoint.name,
      latitude: skiPoint.latitude,
      longitude: skiPoint.longitude,
      skiID: skiPoint.skiID,
      surroundingPoints: FindNearPoint(skiPoint, nearest, xSorted),
    };
    points.values = points.surroundingPoints[0].values;
    return points;
  } else {
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
      name: skiPoint.name,
      latitude: skiPoint.latitude,
      longitude: skiPoint.longitude,
      skiID: skiPoint.skiID,
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
      points.surroundingPoints = FindNearPoint(skiPoint, nearest, xSorted);
    }

    return points;
  }
};

const bilinearInt = (skiPoint) => {
  const x = skiPoint.latitude;
  const y = skiPoint.longitude;
  let dataResult = [];

  if (skiPoint.surroundingPoints.length === 4) {
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
        name: p00.values[i].name,
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
    const [p0, p1] = skiPoint.surroundingPoints;
    if (p0.longitude === p1.longitude) {
      for (let i = 0; i < p0.values.length; i++) {
        const f0 = p0.values[i].data_value;
        const f1 = p1.values[i].data_value;
        const result = {
          name: p1.values[i].name,
          data_value:
            (f0 * (p1.latitude - x) + f1 * (x - p0.latitude)) /
            (p1.latitude - p0.latitude),
        };
        dataResult.push(result);
      }
    } else if (p0.latitude === p1.latitude) {
      for (let i = 0; i < p0.values.length; i++) {
        const f0 = p0.values[i].data_value;
        const f1 = p1.values[i].data_value;
        const result = {
          name: p1.values[i].name,
          data_value:
            (f0 * (p1.longitude - y) + f1 * (y - p0.longitude)) /
            (p1.longitude - p0.longitude),
        };
        dataResult.push(result);
      }
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

const FindNearPoint = (skiPoint, nearest, xSorted) => {
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
      firstNear = [xSorted[firstIndex].latitude, xSorted[firstIndex].longitude];
    }
    if (result < firstResult) {
      firstResult = result;
      secondIndex = firstIndex;
      firstIndex = i;
      secondNear = firstNear;
      firstNear = [xSorted[firstIndex].latitude, xSorted[firstIndex].longitude];
    }
  }
  if (nearest) {
    return [xSorted[firstIndex]];
  } else {
    return [xSorted[firstIndex], xSorted[secondIndex]];
  }
};

const makeJsonFile = (data, outputFileName) => {
  const jsonData = data;
  const outputFolderPath = "../data";
  const fileNameWithJson = `${outputFileName}.json`;
  const outputPath = path.join(outputFolderPath, fileNameWithJson);
  const blobData = JSON.stringify(jsonData, null, 2);

  fs.writeFile(outputPath, blobData, (err) => {
    if (err) {
      console.error("Error writing file:", err);
    } else {
      console.log("File has been saved:", outputPath);
    }
  });
};

const dataMerge = (grid, xSorted, ySorted) => {
  const nearest = false;
  const bilinearedPoint = [];
  skiPoint.map((point) => {
    const surroundingPoints = findPoints(
      point,
      grid,
      xSorted,
      ySorted,
      nearest
    );

    if (nearest) {
      bilinearedPoint.push(surroundingPoints);
    } else {
      const values = bilinearInt(surroundingPoints);
      bilinearedPoint.push(values);
    }
  });

  return bilinearedPoint;
};

const files = getFilesFromDirectory(gridDirectory);

files.forEach((file) => {
  const grid = require(path.join(gridDirectory, file));
  const xSorted = grid.slice().sort((a, b) => a.latitude - b.latitude);
  const ySorted = grid.slice().sort((a, b) => a.longitude - b.longitude);
  const mergedData = dataMerge(grid, xSorted, ySorted);
  // const dataWithFourPoints = mergedData.filter(
  //   (item) => item.surroundingPoints.length === 4
  // );
  console.dir(mergedData.filter((item) => item.surroundingPoints.length === 2));
  const outputFileName = `${fileNamePrefix}_${path.parse(file).name}`;
  makeJsonFile(mergedData, outputFileName);
});
