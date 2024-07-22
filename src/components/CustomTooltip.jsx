import React from "react";

const CustomTooltip = ({ serie, point }) => {
  return (
    <div
      style={{
        background: "#ffffff",
        padding: "10px",
        border: "1px solid #ccc",
      }}
    >
      <strong>{serie.id}</strong>
      <br />
      Week: {point.data.x}
      <br />
      Score: {point.data.y}
    </div>
  );
};

export default CustomTooltip;
