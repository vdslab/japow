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