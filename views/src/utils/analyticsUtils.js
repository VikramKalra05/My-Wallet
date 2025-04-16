import { TESTING_URL } from "../ApiLinks"

fetchAnalytics()

const fetchAnalytics = async (periodType,  startDate, endDate) => {
    try {
        const res = await fetch(`${TESTING_URL}/analytics?periodTypes=${periodType}&startDate=${startDate}&endDate=${endDate}`, 
            {
            method: "POST",
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