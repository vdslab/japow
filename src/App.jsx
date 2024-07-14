import { useEffect, useState } from "react";
//import BumpChart from "./BumpChart";
import NewBumpChart from "./newBumpChart";
import Filter from "./Filter";
import MapDisplay from "./MapDisplay";
import BarChart from "./BarChart";
import snowQualityMap from "./assets/snowQualityMap.json";
import sukijouZahyou from "./assets/ski_resorts_japan.json";
import { Box, Stack } from "@mui/material";
import { mapFilterBypref, snowFilterBypref } from "./filtering";

function App() {
  const [skiTarget, setSkiTarget] = useState(null);
  //各日付の雪質データ
  const [snowData, setSnowData] = useState([...snowQualityMap]);
  // マップに描画するデータ
  const [mapData, setMapData] = useState([...sukijouZahyou]);
  const [filter, setFilter] = useState({ pref: "", sq: "" });

  useEffect(() => {
    let snowFilteredData = [...snowQualityMap];
    let mapFilteredData = [...sukijouZahyou];

    if (filter.pref !== "") {
      console.log(snowQualityMap);
      snowFilteredData = snowFilterBypref(snowQualityMap, filter.pref);
      console.log(snowFilteredData);
      mapFilteredData = mapFilterBypref(sukijouZahyou, filter.pref);
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
        skiTarget={skiTarget}
        setSkiTarget={setSkiTarget}
      ></MapDisplay>

      {/* <BumpChart
        skiTarget={skiTarget}
        setSkiTarget={setSkiTarget}
        skiData={snowData}
      ></BumpChart> */}

      <NewBumpChart data={snowData}></NewBumpChart>

      <BarChart skiTarget={skiTarget} skiData={snowData}></BarChart>
    </>
  );
}

export default App;
