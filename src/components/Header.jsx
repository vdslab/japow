import { Box, Typography } from "@mui/material";

export default function Header() {
  return (
    <Box
      border={2}
      sx={{
        height: "10vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#65D8FF"
      }}>
      <h1>Japow</h1>
      {/* <Typography variant="h3">Japow</Typography> */}
    </Box>
  );
}