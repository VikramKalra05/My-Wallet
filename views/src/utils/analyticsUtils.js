import { TESTING_URL } from "../ApiLinks"
import { apiFetch } from "./http"

// periodId for "this month" in the app timezone (Asia/Kolkata), e.g. "2026-10"
export const getCurrentMonthPeriodId = (date = new Date()) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
}

export const fetchAnalytics = async (periodType,  periodId) => {
    try {
        const res = await apiFetch(`${TESTING_URL}/analytics/user?periodType=${periodType}&periodId=${periodId}`, 
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

export const fetchAnalyticsLast6Months = async () => {
    try {
        const res = await apiFetch(`${TESTING_URL}/analytics/last6Months`, 
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
            return data.data
        }
    } catch (error) {
        console.log(error);
    }
}


// periodTypes =  today, yesterday, thisWeek, lastWeek, thisMonth, lastMonth, last6Months, thisYear, lastYear, custom
// range = day, week, month, year
// custom = startDate, endDate