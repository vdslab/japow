export const sort = (data) => {
  data.forEach((week) => {
    week.value.sort((a, b) => b.snowScore - a.snowScore);
  });
  return data;
};
