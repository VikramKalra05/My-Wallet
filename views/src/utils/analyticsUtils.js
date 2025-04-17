import { TESTING_URL } from "../ApiLinks"

// fetchAnalytics()

export const fetchAnalytics = async (periodType, periodId) => {
    try {
        const res = await fetch(`${TESTING_URL}/analytics/user?periodType=${periodType}&periodId=${periodId}`, 
            {
            method: "GET",
            headers: {
                "Content-type": "Application/json"
            },
            credentials: "include"
        })

        if(res.ok){
            const data = await res.json();
            console.log(data);
            return data
        }
    } catch (error) {
        console.log(error);
    }
}


// periodTypes =  today, yesterday, thisWeek, lastWeek, thisMonth, lastMonth, last6Months, thisYear, lastYear, custom
// range = day, week, month, year
// custom = startDate, endDate