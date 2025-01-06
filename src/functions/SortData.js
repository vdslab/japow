export const sort = (data, sqTarget) => {
  data.forEach((month) => {
    month.days.forEach((day) => {
      day.dayValues.sort((a, b) => b[sqTarget] - a[sqTarget]);
    });
  });
  return data;
};

//選択されたスキー場と雪質が上位のスキー場をnum個分抽出
export const CreateSelecetAndSortData = (data, skiTargetID, sqTarget, num) => {
  const seledtedData = [];
  const notSelectedData = [];
  data
    .slice()
    .sort((a, b) => b[sqTarget] - a[sqTarget])
    .forEach((item, index) => {
      item["rank"] = index + 1;
      if (skiTargetID.includes(item.skiID)) {
        seledtedData.push(item);
      } else {
        notSelectedData.push(item);
      }
    });
  let sortData = [];
  if (num - seledtedData.length > 0) {
    sortData = notSelectedData
      .sort((a, b) => b[sqTarget] - a[sqTarget])
      .slice(0, num - seledtedData.length);
  }
  const displayData = [...sortData, ...seledtedData];
  displayData.sort((a, b) => b[sqTarget] - a[sqTarget]);
  return displayData;
};
