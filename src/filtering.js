export const snowFilterBypref = (data, slectedPref) => {
    // debugger;
    return (
        data.map((month) => {
            month.values = month.values.filter(({ region }) => region === slectedPref);
            month.weeks = month.weeks.map((week) => {
                week.values = week.values.filter(({ region }) => region === slectedPref);
                return week;
            })
            return month;
        })
    )
}

export const mapFilterBypref = (data, slectedPref) => {
    return data.filter(({ region }) => region === slectedPref);
}

// 選択されたスキー場の名前でフィルタリング
export const snowFilterBySkiTarget = (skiTarget, data) => {
    return (
        data.flatMap((month) => {
            return month.weeks.map((week) => {
                let item = {};
                item.name = month.month + "/" + week.week;
                item.values = week.values.filter(({ name }) => name === skiTarget);
                return item;
            })
        })
    )
}