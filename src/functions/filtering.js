import { PERIOD_IDS, PERIOD_MONTH } from "../constants";

//都道府県で雪質データのフィルタリング
export const snowFilterBypref = (data, slectedPref, skiTargetID) => {
  if (!slectedPref.length > 0) {
    return data;
  } else {
    return data.map((month) => {
      month.monthValues = month.monthValues.filter(
        ({ region, skiID }) =>
          slectedPref.includes(region) || skiTargetID.includes(skiID)
      );
      month.days = month.days.map((day) => {
        day.dayValues = day.dayValues.filter(({ region, skiID }) => {
          return slectedPref.includes(region) || skiTargetID.includes(skiID);
        });
        return day;
      });
      return month;
    });
  }
};

//都道府県で地図描画用データのフィルタリング
export const mapFilterBypref = (data, slectedPref, skiTargetID) => {
  if (!slectedPref.length > 0) {
    return data;
  } else {
    return data.filter(
      ({ region, skiID }) =>
        slectedPref.includes(region) || skiTargetID.includes(skiID)
    );
  }
};

//選択された期間で雪質データをフィルタリング
export const snowFilterByPeriod = (data, period) => {
  if (period === PERIOD_IDS.early) {
    return data.filter(({ month }) => PERIOD_MONTH.early.includes(month));
  } else if (period === PERIOD_IDS.middele) {
    return data.filter(({ month }) => PERIOD_MONTH.middele.includes(month));
  } else if (period === PERIOD_IDS.late) {
    return data.filter(({ month }) => PERIOD_MONTH.late.includes(month));
  } else {
    return data;
  }
};

// 選択されたスキー場の名前でフィルタリング
export const snowFilterBySkiTarget = (skiTargetID, data) => {
  return data.flatMap((month) => {
    return month.days.flatMap((day) => {
      let item = {
        name: month.month + "/" + day.day,
        values: day.dayValues.filter(({ skiID }) =>
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
  for (const item of data) {
    if (selectedYear === item.year) {
      seasonData = item.months
      break;
    }
  }
  return seasonData;
}
