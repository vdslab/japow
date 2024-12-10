import { Box, Typography } from "@mui/material";

export default function Header() {
  return (
    <Box
      border={2}
      sx={{
        height: "6vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#54C3F1"
      }}>
      <h2>Japow</h2>
      {/* <Typography variant="h3">Japow</Typography> */}
    </Box>
  );
}