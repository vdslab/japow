import { useEffect, useState } from "react";
//import BumpChart from "./BumpChart";
import NewBumpChart from "./components/newBumpChart";
import Filter from "./components/Filter";
import Map from "./components/Map";
import BarChart from "./components/BarChart";
import snowQualityData from "./assets/snowQualityData.json";
import sukijouZahyou from "./assets/ski_resorts_japan.json";
import { Box, Stack, Grid } from "@mui/material";
import {
  mapFilterBypref,
  snowFilterBypref,
  snowFilterByPeriod,
  snowFilterBySeason,
} from "./functions/filtering";
import Search from "./components/Search";
import { sort } from "./functions/SortData";
import { rank } from "./functions/MakeRank";
import LineChart from "./components/LineChart";

function App() {
  const [skiTargetID, setSkiTargetID] = useState([]);
  //各日付の雪質データ
  const [snowData, setSnowData] = useState([...snowQualityData[0].months]);
  // マップに描画するデータ
  const [mapData, setMapData] = useState([...sukijouZahyou]);
  const [filter, setFilter] = useState({
    pref: "",
    season: "2023/24",
    period: "",
  });
  const [skiColors, setSkiColors] = useState({});

  useEffect(() => {
    let snowFilteredData = JSON.parse(JSON.stringify(snowQualityData));
    snowFilteredData = rank(
      sort(snowFilterBySeason(snowFilteredData, filter.season))
    );
    let mapFilteredData = JSON.parse(JSON.stringify(sukijouZahyou));

    if (filter.pref !== "") {
      snowFilteredData = snowFilterBypref(
        snowFilteredData,
        filter.pref,
        skiTargetID
      );
      mapFilteredData = mapFilterBypref(
        mapFilteredData,
        filter.pref,
        skiTargetID
      );
    }

    if (filter.period !== "") {
      snowFilteredData = snowFilterByPeriod(snowFilteredData, filter.period);
    }
    setMapData(mapFilteredData);
    setSnowData(snowFilteredData);
  }, [filter, skiTargetID]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          p: 1,
          bgcolor: "background.paper",
          borderRadius: 1,
        }}
      >
        <Filter filter={filter} setFilter={setFilter} />
        <Search skiTargetID={skiTargetID} setSkiTargetID={setSkiTargetID} />
      </Box>
      <Grid container spacing={2} sx={{ height: "calc(100vh - 64px)" }}>
        <Grid item xs={6} sx={{ height: "100%" }}>
          <Grid container direction="column" sx={{ height: "100%" }}>
            <Grid item sx={{ height: "50%" }}>
              <Map
                mapData={mapData}
                skiTargetID={skiTargetID}
                setSkiTargetID={setSkiTargetID}
              />
            </Grid>
            <Grid item sx={{ height: "50%", overflow: "hidden" }}>
              <LineChart
                skiTargetID={skiTargetID}
                skiData={snowData}
                skiColors={skiColors}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <NewBumpChart
            data={snowData}
            skiTargetID={skiTargetID}
            setSkiTargetID={setSkiTargetID}
            skiColors={skiColors}
            setSkiColors={setSkiColors}
          />
        </Grid>
      </Grid>
    </>
  );
}

export default App;
