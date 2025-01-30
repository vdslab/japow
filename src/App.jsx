import { useEffect, useRef, useState } from "react";
import NewBumpChart from "./components/newBumpChart";
import Filter from "./components/Filter";
import Map from "./components/Map";
import { Box, Stack, Grid } from "@mui/material";
import {
  mapFilterBypref,
  snowFilterBypref,
  snowFilterByPeriod,
  snowFilterBySeason,
} from "./functions/filtering";
import Search from "./components/Search";
import LineChart from "./components/LineChart";
import Header from "./components/Header.jsx";
import StackedBarChart from "./components/StackedBarChart.jsx";
import { PERIOD_IDS, SNOW_QUALITY_LIST } from "./constants.js";
import { createColors } from "./functions/createColors.js";
import * as React from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

function App() {
  let snowQualityData;
  let sukijouZahyou;
  //各日付の雪質データ
  const [snowData, setSnowData] = useState([]);
  // マップに描画するデータ
  const [mapData, setMapData] = useState([]);
  const snowDataRef = useRef([]);
  const mapDataRef = useRef([]);
  const [skiTargetID, setSkiTargetID] = useState([]);
  const [filter, setFilter] = useState({
    pref: [],
    season: "2023/24",
    period: PERIOD_IDS.all,
    sq: "powder",
  });
  const [skiColors, setSkiColors] = useState({});
  const [sqTarget, setSqTarget] = useState("powder");
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen(true);
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  const action = (
    <React.Fragment>
      {/* <Button color="secondary" size="small" onClick={handleClose}>
        UNDO
      </Button> */}
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );
  useEffect(() => {
    (async () => {
      const sqRes = await fetch("/data/snowQualityData.json");
      snowQualityData = await sqRes.json();
      const szRes = await fetch("/data/ski_resorts_japan_open.json");
      sukijouZahyou = await szRes.json();
      snowDataRef.current = snowQualityData;
      mapDataRef.current = sukijouZahyou;
      setSnowData(
        snowFilterBySeason(
          JSON.parse(JSON.stringify(snowDataRef.current)),
          filter.season
        )
      );
      setMapData(JSON.parse(JSON.stringify(mapDataRef.current)));
    })();
  }, []);
  useEffect(() => {
    let snowFilteredData = JSON.parse(JSON.stringify(snowDataRef.current));
    let mapFilteredData = JSON.parse(JSON.stringify(mapDataRef.current));
    snowFilteredData = snowFilterBySeason(snowFilteredData, filter.season);
    // snowFilteredData = snowFilterBySeason(snowFilteredData, filter.season)

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

  let prevSkiColors = useRef([]);
  useEffect(() => {
    setSkiColors(createColors(skiTargetID, prevSkiColors.current, skiColors));
    prevSkiColors.current = [...skiTargetID];
  }, [skiTargetID]);
  return (
    <>
      <Box
        sx={{
          width: "100vw",
          height: "100vh",
          // backgroundColor: "#00FF00"
        }}
      >
        {/* ヘッダー */}
        <Header />

        {/* フィルター、検索 */}
        <Box
          sx={{
            height: "9%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 0.7,
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
            mapData={mapData}
            setOpen={setOpen}
          ></Search>
        </Box>

        {/* メインの大枠部分 */}
        <Box
          sx={{
            width: "100%",
            height: "85%",
          }}
        >
          {/* コンテナを作る */}
          <Grid
            container
            direction="row"
            spacing={1}
            sx={{
              // height=85%だと、スクロールバーの分が余分になる気がする
              // height: "85%",
              height: "100%",
              // m: 0,
              backgroundColor: "#CCF2FF",
              // backgroundColor: "#d52b2b",
            }}
          >
            {/* 左側の大枠 */}
            <Grid item xs={6}>
              {/* マップ枠 */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "45%",
                  overflow: "hidden",
                  mb: 1,
                  ml: 1,
                  backgroundColor: "#FFFFFF",
                  borderRadius: 2,
                }}
              >
                <Map
                  mapData={mapData}
                  skiTargetID={skiTargetID}
                  setSkiTargetID={setSkiTargetID}
                  skiColors={skiColors}
                  setOpen={setOpen}
                />
              </Box>

              {/* 折れ線グラフ枠 */}
              <Box
                sx={{
                  height: "50%",
                  mt: 1,
                  ml: 1,
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
                  {`${SNOW_QUALITY_LIST[sqTarget]} になる確率(%) 推移`}
                </h3>
                <LineChart
                  skiTargetID={skiTargetID}
                  skiData={snowData}
                  skiColors={skiColors}
                  sqTarget={sqTarget}
                ></LineChart>
              </Box>
            </Grid>

            {/* 右側の大枠 */}
            <Grid item xs={6}>
              {/* 棒グラフ枠 */}
              <Box
                id={"Bump"}
                sx={{
                  // width: "100%",
                  height: "98.3%",
                  mr: 1,

                  // p: 1,
                  // pb: 1,
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
                  {`${SNOW_QUALITY_LIST[sqTarget]} になる確率(%) ランキング`}
                </h3>
                <StackedBarChart
                  snowData={snowData}
                  sqTarget={sqTarget}
                  filter={filter}
                  skiTargetID={skiTargetID}
                  setSkiTargetID={setSkiTargetID}
                  setOpen={setOpen}
                ></StackedBarChart>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message="スキー場は10件までしか選択できません"
        action={action}
      />
    </>
  );
}
export default App;
