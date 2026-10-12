import { PieChart } from "@mui/x-charts";
import React, { useEffect, useRef, useState } from "react";

/* Below this container width the right-hand column legend would squeeze the
   pie, so it moves under the chart as a wrapping row instead. */
const NARROW_WIDTH = 460;

const PieChartForAnalytics = ({ pieData }) => {
  const wrapRef = useRef(null);
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return undefined;

    if (typeof ResizeObserver === "undefined") {
      setNarrow(el.clientWidth < NARROW_WIDTH);
      return undefined;
    }

    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect?.width ?? el.clientWidth;
      setNarrow(width < NARROW_WIDTH);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const legend = narrow
    ? {
        direction: "row",
        position: { vertical: "bottom", horizontal: "middle" },
        padding: 8,
        itemMarkWidth: 14,
        itemMarkHeight: 14,
        markGap: 6,
        itemGap: 8,
        labelStyle: {
          fontSize: 12,
          fontWeight: 500,
        },
      }
    : {
        direction: "column",
        position: { vertical: "middle", horizontal: "right" },
        padding: 20,
        marginLeft: 20,
        itemMarkWidth: 18,
        itemMarkHeight: 18,
        markGap: 6,
        itemGap: 10,
        labelStyle: {
          fontSize: 13,
          fontWeight: 500,
        },
      };

  return (
    <div ref={wrapRef}>
      {/* No width prop: the chart fills the parent and tracks resizes itself. */}
      <PieChart
        series={[
          {
            data: pieData,
            innerRadius: 40,
            outerRadius: 100,
            paddingAngle: 0,
            cornerRadius: 5,
            highlightScope: { faded: "none", highlighted: "item" },
            faded: { additionalRadius: 0 },
          },
        ]}
        height={narrow ? 320 : 300}
        slotProps={{ legend }}
        sx={{
          margin: "auto",
          width: "100%",
          maxWidth: "min(500px, 100%)",
        }}
      />
    </div>
  );
};

export default PieChartForAnalytics;
