import { useEffect, useState } from "react";
import BumpChart from "./BumpChart";
import Filter from "./Filter";
import LinearInt from "./LinearInt";
import MapDisplay from "./MapDisplay";
import snowQualityMap from "./assets/snowQualityMap.json";
import sukijouZahyou from "./assets/ski_resorts_japan.json";
import { Box, Stack } from "@mui/material";
import { mapFilterBypref, snowFilterBypref } from "./filtering";

function App() {
  //各日付の雪質データ
  const [snowData, setsnowData] = useState([...snowQualityMap]);
  // マップに描画するデータ
  const [mapData, setMapData] = useState([...sukijouZahyou])
  const [filter, setFilter] = useState({ "pref": "", "sq": "" });

  useEffect(() => {
    let snowFilteredData = [...snowQualityMap];
    let mapFilteredData = [...sukijouZahyou];
    // snowFilteredData = filter.pref !== "" && snowFilterBypref(snowData, filter.pref);
    mapFilteredData = filter.pref !== "" ? mapFilterBypref(mapFilteredData, filter.pref) : mapFilteredData;

    setsnowData(snowFilteredData);
    console.log(mapFilteredData);
    setMapData(mapFilteredData);
  }, [filter]);
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 1,
          m: 1,
          bgcolor: 'background.paper',
          borderRadius: 1,
        }}
      >
        <h1>JAPOW!</h1>
        <Filter filter={filter} setFilter={setFilter}></Filter>
      </Box>
      <MapDisplay mapData={mapData}></MapDisplay>
      <LinearInt></LinearInt>
      <BumpChart></BumpChart>
    </>
  );
}

export default App;
