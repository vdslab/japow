export const avgRank = (SortedData, start, end) => {
  const rankSums = {};
  const rankCounts = {};
  const skiIDs = {}; // skiIDを保存するオブジェクト

  SortedData.forEach((monthData) => {
    monthData.days.forEach((dayData) => {
      dayData.dayValues.forEach((skiResort) => {
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

//各スキー場の雪質スコアを平均化して返す
export const calcPeriodAverage = (data) => {
  const periodSumData = [];
  const periodAverageData = [];
  data.forEach((monthData) => {
    monthData.days.forEach((dayData => {
      dayData.dayValues.forEach((skiResort) => {
        if (!periodSumData[skiResort.skiID]) {
          periodSumData[skiResort.skiID] = {
            "name": skiResort.name,
            "region": skiResort.region,
            "skiID": skiResort.skiID,
            "powder": skiResort.powder,
            "dry": skiResort.dry,
            "wet": skiResort.wet,
            "shaba": skiResort.shaba,
            "burn": skiResort.burn,
            "new": skiResort.new,
            "count": 1
          }
        } else {
          periodSumData[skiResort.skiID].powder += skiResort.powder;
          periodSumData[skiResort.skiID].dry += skiResort.dry;
          periodSumData[skiResort.skiID].wet += skiResort.wet;
          periodSumData[skiResort.skiID].shaba += skiResort.shaba;
          periodSumData[skiResort.skiID].burn += skiResort.burn;
          periodSumData[skiResort.skiID].new += skiResort.new;
          periodSumData[skiResort.skiID].count += 1;
        }
      });
    }));
  });
  periodSumData.forEach((skiResort) => {
    periodAverageData.push({
      "name": skiResort.name,
      "region": skiResort.region,
      "skiID": skiResort.skiID,
      "powder": skiResort.powder / skiResort.count,
      "dry": skiResort.dry / skiResort.count,
      "wet": skiResort.wet / skiResort.count,
      "shaba": skiResort.shaba / skiResort.count,
      "burn": skiResort.burn / skiResort.count,
      "new": skiResort.new / skiResort.count
    })
  })
  return periodAverageData;
}
