export const avgRank = (SortedData, start, end) => {
  const rankSums = {};
  const rankCounts = {};
  const skiIDs = {}; // skiIDを保存するオブジェクト

  SortedData.forEach((monthData) => {
    monthData.weeks.forEach((weekData) => {
      weekData.weekValues.forEach((skiResort) => {
        const { name, rank, skiID } = skiResort;
        if (!rankSums[name]) {
          rankSums[name] = 0;
          rankCounts[name] = 0;
          skiIDs[name] = skiID; // skiIDを保存
        }
        rankSums[name] += rank;
        rankCounts[name] += 1;
      });
    });
  });

  const averageRanks = [];
  for (const name in rankSums) {
    const avgRank = rankSums[name] / rankCounts[name];
    averageRanks.push({ name, avgRank, skiID: skiIDs[name] }); // skiIDを追加
  }

  averageRanks.sort((a, b) => a.avgRank - b.avgRank);
  return averageRanks;
};
