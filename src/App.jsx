import { useEffect, useState } from "react";
//import BumpChart from "./BumpChart";
import NewBumpChart from "./newBumpChart";
import Filter from "./Filter";
import MapDisplay from "./MapDisplay";
import BarChart from "./BarChart";
import snowQualityMap from "./assets/snowQualityMap2324.json";
import sukijouZahyou from "./assets/ski_resorts_japan.json";
import { Box, Stack } from "@mui/material";
import { mapFilterBypref, snowFilterBypref, snowFilterByPeriod } from "./filtering";

function App() {
  const [skiTargetID, setSkiTargetID] = useState(null);
  //各日付の雪質データ
  const [snowData, setSnowData] = useState([...snowQualityMap]);
  // マップに描画するデータ
  const [mapData, setMapData] = useState([...sukijouZahyou]);
  const [filter, setFilter] = useState({ "pref": "", "period":"", "sq": "" });

  useEffect(() => {
    let snowFilteredData = [...snowQualityMap];
    let mapFilteredData = [...sukijouZahyou];

    if (filter.pref !== "") {
      snowFilteredData = snowFilterBypref(snowFilteredData, filter.pref);
      mapFilteredData = mapFilterBypref(mapFilteredData, filter.pref);
    }

    if (filter.period != "") {
      snowFilteredData = snowFilterByPeriod(snowFilteredData, filter.period);
      console.log(snowFilteredData);
    }

    setSnowData([...snowFilteredData]);
    setMapData([...mapFilteredData]);
  }, [filter]);
  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          p: 1,
          m: 1,
          bgcolor: "background.paper",
          borderRadius: 1,
        }}
      >
        <h1>JAPOW!</h1>
        <Filter filter={filter} setFilter={setFilter}></Filter>
      </Box>
      <MapDisplay
        mapData={mapData}
        skiTargetID={skiTargetID}
        setSkiTargetID={setSkiTargetID}
      ></MapDisplay>

      {/* <BumpChart
        skiTargetID={skiTargetID}
        setSkiTargetID={setSkiTargetID}
        skiData={snowData}
      ></BumpChart> */}

      <NewBumpChart
        data={snowData}
        skiTargetID={skiTargetID}
        setSkiTargetID={setSkiTargetID}
      ></NewBumpChart>

      <BarChart skiTargetID={skiTargetID} skiData={snowData}></BarChart>
    </>
  );
}

export default App;
