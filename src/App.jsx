import { useEffect, useState } from "react";
//import BumpChart from "./BumpChart";
import NewBumpChart from "./components/newBumpChart";
import Filter from "./components/Filter";
import Map from "./components/Map";
import BarChart from "./components/BarChart";
import snowQualityMap from "./assets/snowQualityMap2324.json";
import sukijouZahyou from "./assets/ski_resorts_japan.json";
import { Box, Stack, Grid } from "@mui/material";
import {
  mapFilterBypref,
  snowFilterBypref,
  snowFilterByPeriod,
} from "./functions/filtering";
import Search from "./components/Search";
import { sort } from "./functions/SortData";
import { rank } from "./functions/MakeRank";
import LineChart from "./components/LineChart";

function App() {
  const [skiTargetID, setSkiTargetID] = useState([]);
  //各日付の雪質データ
  const [snowData, setSnowData] = useState([...snowQualityMap]);
  // マップに描画するデータ
  const [mapData, setMapData] = useState([...sukijouZahyou]);
  const [filter, setFilter] = useState({ pref: "", period: "", sq: "" });
  const [skiColors, setSkiColors] = useState({});

  useEffect(() => {
    setSnowData(rank(sort(snowData)));
  }, []);

  useEffect(() => {
    let snowFilteredData = JSON.parse(JSON.stringify(snowQualityMap));
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
      //console.log(snowFilteredData);
    }

    setSnowData(snowFilteredData);
    setMapData(mapFilteredData);
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
        <Filter filter={filter} setFilter={setFilter}></Filter>
        <Search
          skiTargetID={skiTargetID}
          setSkiTargetID={setSkiTargetID}
        ></Search>
      </Box>
      <Grid container spacing={2} sx={{ height: "calc(100vh - 64px)" }}>
        <Grid item xs={6} sx={{ height: "100%" }}>
          <Box sx={{ height: "50%", overflow: "hidden" }}>
            <Map
              mapData={mapData}
              skiTargetID={skiTargetID}
              setSkiTargetID={setSkiTargetID}
            />
          </Box>
          {/* <Box sx={{ height: "50%", overflow: "hidden" }}> */}
          {/* <BarChart
            skiTargetID={skiTargetID}
            skiData={snowData}
            skiColors={skiColors}
          /> */}
          <LineChart
            skiTargetID={skiTargetID}
            skiData={snowData}
            skiColors={skiColors}
          ></LineChart>
          {/* </Box> */}
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
            skiColors={skiColors}
            setSkiColors={setSkiColors}
          ></NewBumpChart>
        </Grid>
      </Grid>
    </>
  );
}

export default App;
