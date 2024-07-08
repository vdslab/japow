export const rank = (SortedData) => {
  SortedData.forEach((month) => {
    month.weeks.forEach((week) => {
      week.values.forEach((item, index) => {
        item.rank = index + 1;
      });
    })
  });
  return SortedData;
};
