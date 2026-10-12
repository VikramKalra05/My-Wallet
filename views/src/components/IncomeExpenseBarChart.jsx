import React from "react";
import { BarChart } from "@mui/x-charts";

/* SVG fills can't read CSS variables — mirror the index.css tokens here. */
const INCOME_COLOR = "#15803d"; // --income
const EXPENSE_COLOR = "#dc2626"; // --expense

const IncomeExpenseBarChart = ({ data }) => {
  return (
    // No width prop on the chart: it fills the parent and tracks resizes.
    <div style={{ height: 250, width: "100%", minWidth: 0 }}>
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
            color: INCOME_COLOR,
            barThickness: 50,
          },
          {
            data: [null, data.expense || 0],
            color: EXPENSE_COLOR,
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
