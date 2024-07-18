import { useEffect, useState } from "react";
//import BumpChart from "./BumpChart";
import NewBumpChart from "./newBumpChart";
import Filter from "./Filter";
import Map from "./Map";
import BarChart from "./BarChart";
import snowQualityMap from "./assets/snowQualityMap2324.json";
import sukijouZahyou from "./assets/ski_resorts_japan.json";
import { Box, Stack, Grid } from "@mui/material";
import {
  mapFilterBypref,
  snowFilterBypref,
  snowFilterByPeriod,
} from "./filtering";

function App() {
  const [skiTargetID, setSkiTargetID] = useState(null);
  //各日付の雪質データ
  const [snowData, setSnowData] = useState([...snowQualityMap]);
  // マップに描画するデータ
  const [mapData, setMapData] = useState([...sukijouZahyou]);
  const [filter, setFilter] = useState({ pref: "", period: "", sq: "" });

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
        <Filter filter={filter} setFilter={setFilter}></Filter>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Map
            mapData={mapData}
            skiTargetID={skiTargetID}
            setSkiTargetID={setSkiTargetID}
          ></Map>
        </Grid>
        {/* <BumpChart
        skiTargetID={skiTargetID}
        setSkiTargetID={setSkiTargetID}
        skiData={snowData}
      ></BumpChart> */}

        <Grid item xs={6}>
          <NewBumpChart
            data={snowData}
            skiTargetID={skiTargetID}
            setSkiTargetID={setSkiTargetID}
          ></NewBumpChart>

          <BarChart skiTargetID={skiTargetID} skiData={snowData}></BarChart>

        </Grid>
      </Grid>
    </>
  );
}

export default App;
