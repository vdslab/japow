export const sort = (data, sqTarget) => {
  data.forEach((month) => {
    month.days.forEach((day) => {
      day.dayValues.sort((a, b) => b[sqTarget] - a[sqTarget]);
    });
  });
  return data;
};
