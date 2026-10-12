import { BarChart } from "@mui/x-charts/BarChart";
import { blueberryTwilightPaletteLight } from "@mui/x-charts/colorPalettes";
import React from "react";

/* SVG <text> can't reliably ellipsize on its own, so long category names are
   cut here — the chart's left margin only has to fit this many characters. */
const MAX_LABEL_LENGTH = 14;
const LABEL_BOX_WIDTH = 100;

const truncateLabel = (label) =>
  label.length > MAX_LABEL_LENGTH
    ? `${label.slice(0, MAX_LABEL_LENGTH - 1)}…`
    : label;

const BarChartForAnalytics = ({ barData }) => {
  const labels = barData.categories.map(truncateLabel);
  // Per-bar colours come from the palette Analytics passes down; cycle MUI's
  // default palette only as a safety net so no bar ever renders uncoloured.
  const colors = barData.colors?.length
    ? barData.colors
    : labels.map(
        (_, index) =>
          blueberryTwilightPaletteLight[index % blueberryTwilightPaletteLight.length]
      );

  return (
    // No width prop: the chart fills its container and tracks resizes itself.
    <BarChart
      height={250}
      layout="horizontal"
      // A single-series legend swatch would show the wrong colour — each bar
      // gets its own hue through the axis colour scale instead.
      legend={{ hidden: true }}
      series={[
        { data: barData.values, label: "Amount spent" },
      ]}
      yAxis={[
        {
          data: labels,
          scaleType: "band",
          // One colour per bar from the palette array (replaces the old
          // nth-of-type CSS hacks that left the 5th bar on MUI's default).
          colorMap: { type: "ordinal", values: labels, colors },
          tickLabelStyle: {
            fontSize: 13,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            width: LABEL_BOX_WIDTH,
          },
        },
      ]}
      grid={{ horizontal: true }}
      margin={{ top: 14, bottom: 28, left: 115, right: 24 }}
    />
  );
};

export default BarChartForAnalytics;
