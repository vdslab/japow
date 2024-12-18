import * as d3 from "d3";

//選択されたスキー場に対応する色を生成
export const createColors = (skiTargetID, prevSkiTargetID, skiColors) => {
  const skiTargetNames = [];
  const newSkiColors = { ...skiColors };
  const colorScheme = d3.schemeCategory10;
  if (skiTargetID.length > prevSkiTargetID.length) {
    const newSkiID = skiTargetID.find(
      (item) => !prevSkiTargetID.includes(item)
    );
    newSkiColors[newSkiID] = searchNotUsedColor(colorScheme, newSkiColors);
  } else if (skiTargetID.length < prevSkiTargetID) {
    const deleteSkiID = prevSkiTargetID.find(
      (item) => !skiTargetID.includes(item)
    );
    delete prevSkiTargetID[deleteSkiID];
  }
  return newSkiColors;
};

//使っていない色を見つける
const searchNotUsedColor = (colorScheme, skiColors) => {
  let notUsedColor;
  let useCount = Infinity;
  for (const cs of colorScheme) {
    let csCount = Object.values(skiColors).reduce((prev, cur) => {
      return cur === cs ? prev + 1 : prev;
    }, 0);
    if (csCount === 0) {
      notUsedColor = cs;
      break;
    }
    if (useCount > csCount) {
      notUsedColor = cs;
      useCount = csCount;
    }
  }
  return notUsedColor;
};
