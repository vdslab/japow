export const snowFilterBypref = (data, slectedPref) => {
    debugger;
    return (
        data.map((month) => {
            return (
                month.values.filter(({ region }) => region === slectedPref)
            );
        })
    )
}

export const mapFilterBypref = (data, slectedPref) => {
    return data.filter(({ region }) => region === slectedPref);
}