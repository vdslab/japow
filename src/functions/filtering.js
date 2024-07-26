//都道府県で雪質データのフィルタリング
export const snowFilterBypref = (data, slectedPref, skiTargetID) => {
  if (slectedPref === "") {
    return data;
  } else {
    return data.map((month) => {
      month.monthValues = month.monthValues.filter(
        ({ region, skiID }) =>
          region === slectedPref || skiTargetID.includes(skiID)
      );
      month.weeks = month.weeks.map((week) => {
        week.weekValues = week.weekValues.filter(({ region, skiID }) => {
          return region === slectedPref || skiTargetID.includes(skiID);
        });
        return week;
      });
      return month;
    });
  }
};

//都道府県で地図描画用データのフィルタリング
export const mapFilterBypref = (data, slectedPref, skiTargetID) => {
  if (slectedPref === "") {
    return data;
  } else {
    return data.filter(
      ({ region, skiID }) =>
        region === slectedPref || skiTargetID.includes(skiID)
    );
  }
};

//選択された期間で雪質データをフィルタリング
export const snowFilterByPeriod = (data, period) => {
  if (period === "") {
    return data;
  } else {
    return data.filter(({ month }) => month === period);
  }
};

// 選択されたスキー場の名前でフィルタリング
export const snowFilterBySkiTarget = (skiTargetID, data) => {
  return data.flatMap((month) => {
    return month.weeks.flatMap((week) => {
      let item = {
        name: month.month + "/" + week.week,
        values: week.weekValues.filter(({ skiID }) =>
          skiTargetID.includes(skiID)
        ),
      };
      return item;
    });
  });
};

//シーズンでフィルタリング
export const snowFilterBySeason = (data, selectedYear) => {
  let seasonData = []
  for(const item of data) {
    if(selectedYear === item.year) {
      seasonData = item.months
      break;
    }
  }
  return seasonData;
}
