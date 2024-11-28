import { useEffect, useState } from "react";
//import BumpChart from "./BumpChart";
import NewBumpChart from "./components/newBumpChart";
import Filter from "./components/Filter";
import Map from "./components/Map";
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
import Header from "./components/Header.jsx";
import  StackedBarChart  from "./components/StackedBarChart.jsx";
import { PERIOD_IDS } from "./constants.js";

function App() {
  const [skiTargetID, setSkiTargetID] = useState([]);
  //各日付の雪質データ
  const [snowData, setSnowData] = useState([...snowQualityData[0].months]);
  // マップに描画するデータ
  const [mapData, setMapData] = useState([...sukijouZahyou]);
  const [filter, setFilter] = useState({
    pref: [],
    season: "2023/24",
    period: PERIOD_IDS.ALL,
    sq: "powder",
  });
  const [skiColors, setSkiColors] = useState({});
  const [sqTarget, setSqTarget] = useState("powder");

  useEffect(() => {
    let snowFilteredData = JSON.parse(JSON.stringify(snowQualityData));
    snowFilteredData = rank(
      sort(snowFilterBySeason(snowFilteredData, filter.season), sqTarget)
    );
    // snowFilteredData = snowFilterBySeason(snowFilteredData, filter.season)
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
      <Box sx={{ width: "100vw", height: "100vh" }}>
        <Header />

        <Box
          sx={{
            height: "10vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 1,
          }}
        >
          <Filter
            filter={filter}
            setFilter={setFilter}
            setSqTarget={setSqTarget}
            sqTarget={sqTarget}
          ></Filter>
          <Search
            skiTargetID={skiTargetID}
            setSkiTargetID={setSkiTargetID}
          ></Search>
        </Box>

        <Grid
          container
          direction="row"
          spacing={1}
          sx={{
            width: "100%",
            height: "80vh",
            m: 0,
            backgroundColor: "#CCF2FF",
          }}
        >
          <Grid item xs={6}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "40%",
                overflow: "hidden",
                mb: 1,
                backgroundColor: "#FFFFFF",
                borderRadius: 2,
              }}
            >
              <Map
                mapData={mapData}
                skiTargetID={skiTargetID}
                setSkiTargetID={setSkiTargetID}
              />
            </Box>
            <Box
              sx={{
                height: "50%",
                mt: 1,
                p: 1,
                backgroundColor: "#FFFFFF",
                borderRadius: 2,
              }}
            >
              <h3
                style={{
                  margin: "auto",
                  textAlign: "center",
                }}
              >
                雪質のスコア推移
              </h3>
              <LineChart
                skiTargetID={skiTargetID}
                skiData={snowData}
                skiColors={skiColors}
                sqTarget={sqTarget}
              ></LineChart>
            </Box>
          </Grid>

          <Grid item xs={6}>
            <Box
              id={"Bump"}
              sx={{
                height: "89%",
                pt: 1,
                pb: 1,
                overflow: "hidden",
                backgroundColor: "white",
                borderRadius: 2,
              }}
            >
              <h3
                style={{
                  marginBottom: "5px",
                  textAlign: "center",
                }}
              >
                雪質の平均順位
              </h3>
              <StackedBarChart
                snowData={snowData}
                sqTarget={sqTarget}
                filter={filter}
                skiTargetID={skiTargetID}
                setSkiTargetID={setSkiTargetID}
              ></StackedBarChart>
              {/* <NewBumpChart
                data={snowData}
                skiTargetID={skiTargetID}
                setSkiTargetID={setSkiTargetID}
                skiColors={skiColors}
                setSkiColors={setSkiColors}
              ></NewBumpChart> */}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
export default App;
