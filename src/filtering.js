//都道府県で雪質データのフィルタリング
export const snowFilterBypref = (data, slectedPref) => {
    if (slectedPref === "") {
        return data
    } else {
        return data.map((month) => {
            month.monthValues = month.monthValues.filter(
                ({ region }) => region === slectedPref
            );
            month.weeks = month.weeks.map((week) => {
                week.weekValues = week.weekValues.filter(
                    ({ region }) => region === slectedPref
                );
                return week;
            });
            return month;
        });
    }
};

//都道府県で地図描画用データのフィルタリング
export const mapFilterBypref = (data, slectedPref) => {
    if (slectedPref === "") {
        return data;
    } else {
        return data.filter(({ region }) => region === slectedPref);
    }
};

//選択された期間で雪質データをフィルタリング
export const snowFilterByPeriod = (data, period) => {
    if (period === "") {
        return data;
    } else {
        return data.filter(({ month }) => month === period);
    }
}

// 選択されたスキー場の名前でフィルタリング
export const snowFilterBySkiTarget = (skiTargetID, data) => {
    return data.flatMap((month) => {
        return month.weeks.map((week) => {
            let item = {};
            item.name = month.month + "/" + week.week;
            item.values = week.weekValues.filter(
                ({ skiID }) => skiID === skiTargetID
            );
            return item;
        });
    });
};
