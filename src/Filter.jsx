import prefData from "./assets/prefectures.json";

const Filter = ({filter, setFilter}) => {
    return(
        <div>
            <select id="pref"
            onChange={(e) => {
                setFilter({"pref":e.target.value, "sq":filter.sq});
            }}
            >
                <option key="none" value=""
                >未選択</option>
                {prefData.map(({prefCode, name}) => {
                    return(
                        <option key={prefCode} value={name}>{name}</option>
                    )
                })}
            </select>
        </div>
    )
}

export default Filter;