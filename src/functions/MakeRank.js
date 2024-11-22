export const rank = (SortedData) => {
  SortedData.forEach((month) => {
    month.days.forEach((day) => {
      day.dayValues.forEach((item, index) => {
        item.rank = index + 1;
      });
    });
  });
  return SortedData;
};
