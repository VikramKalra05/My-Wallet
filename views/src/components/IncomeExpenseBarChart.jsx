import React from "react";
import { BarChart } from "@mui/x-charts";

const IncomeExpenseBarChart = ({ data }) => {
  return (
    <div style={{ height: 250, width: "100%" }}>
      <BarChart
        layout="horizontal"
        yAxis={[
          {
            scaleType: "band",
            data: ["Income", "Expense"],
          },
        ]}
        series={[
          {
            data: [data.income || 0, null],
            color: "#4caf50", // Income
            barThickness: 50,
          },
          {
            data: [null, data.expense || 0],
            color: "#f44336", // Expense
            barThickness: 50,
          },
        ]}
        xAxis={[
          {
            label: "Amount",
          },
        ]}
        margin={{ left: 100 }}
        slotProps={{
          bar: {
            barGap: 0, // spacing between bars
          },
        }}
      />
    </div>
  );
};

export default IncomeExpenseBarChart;
