export const avgRank = (SortedData, start, end) => {
  const rankSums = {};
  const rankCounts = {};
  SortedData.forEach((monthData) => {
    monthData.weeks.forEach((weekData) => {
      weekData.values.forEach((skiResort) => {
        const { name, rank } = skiResort;
        if (!rankSums[name]) {
          rankSums[name] = 0;
          rankCounts[name] = 0;
        }
        rankSums[name] += rank;
        rankCounts[name] += 1;
      });
    })
  });
  const averageRanks = [];
  for (const name in rankSums) {
    const avgRank = rankSums[name] / rankCounts[name];
    averageRanks.push({ name, avgRank });
  }
  averageRanks.sort((a, b) => a.avgRank - b.avgRank);
  return averageRanks;
};
