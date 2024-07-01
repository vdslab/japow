export const rank = (SortedData) => {
  SortedData.forEach((week) => {
    week.value.forEach((item, index) => {
      item.rank = index + 1;
    });
  });
  return SortedData;
};
