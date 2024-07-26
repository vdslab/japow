import { Box, Typography } from "@mui/material";

export default function Header() {
  return (
    <Box
      sx={{
        height: "10vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#202020"
      }}>
      <h1>Japow</h1>
      {/* <Typography variant="h3">Japow</Typography> */}
    </Box>
  );
}