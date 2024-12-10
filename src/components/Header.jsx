import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  Card,
  CardContent,
  CardHeader,
  IconButton,
} from "@mui/material";
import { useState } from "react";

export default function Header() {
  return (
    <Box
      border={2}
      sx={{
        height: "10vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#65D8FF",
        padding: "0 20px",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <h1>Japow</h1>
      </Box>
    </Box>
  );
}
