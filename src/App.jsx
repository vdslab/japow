import BumpChart from "./BumpChart";
import LinearInt from "./LinearInt";
import MapDisplay from "./MapDisplay";
import { useState } from "react";
import { Stack } from "@mui/material";

function App() {
  const [skiTarget, setSkiTarget] = useState(null);
  return (
    <>
      <h1>JAPOW!</h1>
      <MapDisplay
        skiTarget={skiTarget}
        setSkiTarget={setSkiTarget}
      ></MapDisplay>
      <LinearInt></LinearInt>
      <BumpChart skiTarget={skiTarget} setSkiTarget={setSkiTarget}></BumpChart>
    </>
  );
}

export default App;
