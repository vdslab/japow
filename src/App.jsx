import BumpChart from "./BumpChart";
import LinearInt from "./LinearInt";
import MapDisplay from "./MapDisplay";
import { Stack } from "@mui/material";

function App() {
  return (
    <>
      <h1>JAPOW!</h1>
      <MapDisplay></MapDisplay>
      <LinearInt></LinearInt>
      <BumpChart></BumpChart>
    </>
  );
}

export default App;
