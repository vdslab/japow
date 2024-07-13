export const sort = (data) => {
  data.forEach((month) => {
    // console.log(week);
    month.weeks.forEach((week) => {
      week.values.sort((a, b) => b.snowScore - a.snowScore);
    })
  });
  return data;
};
