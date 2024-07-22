export const rank = (SortedData) => {
  SortedData.forEach((month) => {
    month.weeks.forEach((week) => {
      week.weekValues.forEach((item, index) => {
        item.rank = index + 1;
      });
    });
  });
  return SortedData;
};
