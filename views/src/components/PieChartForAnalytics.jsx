import { PieChart } from '@mui/x-charts'
import React from 'react'

const PieChartForAnalytics = ({pieData}) => {
    return (
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
            height={250}
            legend={{
                direction: "column",
                position: { vertical: "middle", horizontal: "right" },
                padding: 20,
                marginLeft: 20,
                itemMarkWidth: 20,
                itemMarkHeight: 20,
                markGap: 6,
                itemGap: 10,
                labelStyle: {
                    fontSize: 14,
                    fontWeight: 500
                },
            }}
            sx={{
                margin: "auto",
                width: "100%",
                maxWidth: "500px",
                "& .MuiChartsLegend-root": {
                    marginLeft: "20px", // 👈 extra spacing between chart and legend
                    // display
                },
            }}
        />
    )
}

export default PieChartForAnalytics