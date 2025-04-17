import { BarChart } from '@mui/x-charts'
import React from 'react'

const BarChartForAnalytics = ({ barData }) => {
    return (
        <BarChart
            width={600}
            height={250}
            layout="horizontal"
            series={[
                { data: barData.values, label: "Amount Spent", color: "#3f51b5" },
            ]}
            yAxis={[
                {
                    data: barData.categories,
                    scaleType: "band",
                    tickLabelStyle: {
                        fontSize: 14,
                        overflow: "visible",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        width: 100
                    },
                },
            ]}
            grid={{ horizontal: true }}
            margin={{ top: 40, bottom: 30, left: 200, right: 30 }}
            sx={{

                ".MuiBarElement-root:nth-of-type(1)": { fill: "#26A69A" },
                ".MuiBarElement-root:nth-of-type(2)": { fill: "#42A5F5" },
                ".MuiBarElement-root:nth-of-type(3)": { fill: "#EF5350" },
                ".MuiBarElement-root:nth-of-type(4)": { fill: "#FFA726" },
                // ".MuiBarElement-root:nth-of-type(5)": { fill: "#FFA726" },
            }}
        />
    )
}

export default BarChartForAnalytics