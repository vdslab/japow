export const snowFilterBypref = (data, slectedPref) => {
  // debugger;
  return data.map((month) => {
    month.monthValues = month.monthValues.filter(
      ({ region }) => region === slectedPref
    );
    month.weeks = month.weeks.map((week) => {
      week.weekValues = week.weekValues.filter(
        ({ region }) => region === slectedPref
      );
      return week;
    });
    return month;
  });
};

export const mapFilterBypref = (data, slectedPref) => {
  return data.filter(({ region }) => region === slectedPref);
};

// 選択されたスキー場の名前でフィルタリング
export const snowFilterBySkiTarget = (skiTargetID, data) => {
  return data.flatMap((month) => {
    return month.weeks.map((week) => {
      let item = {};
      item.name = month.month + "/" + week.week;
      item.values = week.weekValues.filter(
        ({ skiID }) => skiID === skiTargetID
      );
      return item;
    });
  });
};
