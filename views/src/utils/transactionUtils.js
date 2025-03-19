import {TESTING_URL} from "../ApiLinks"

export const createTransaction = async (credentials) => {
    try {
        const res = await fetch(`${TESTING_URL}/transaction/create`, {
            method: "POST",
            headers: {
                "Content-type": "Application/json"
            },
            body: JSON.stringify(credentials)
        })

        if(res.ok){
            const data = await res.json();
            console.log(`Transaction created: ${data}`);
            return data;
        }

    } catch (error) {
        console.log("error in creating transaction:", error);
    }
} 

export const updateTransaction = async (credentials) => {
    try {
        const res = await fetch(`${TESTING_URL}/transaction/create`, {
            method: "POST",
            headers: {
                "Content-type": "Application/json"
            },
            body: JSON.stringify(credentials)
        })

        if(res.ok){
            const data = await res.json();
            console.log(`Transaction created: ${data}`);
            return data;
        }

    } catch (error) {
        console.log("error in creating transaction:", error);
    }
} 

export const getAllTransactionsOfUser = async (credentials) => {
    try {
        const res = await fetch(`${TESTING_URL}/transaction/create`, {
            method: "POST",
            headers: {
                "Content-type": "Application/json"
            },
            body: JSON.stringify(credentials)
        })

        if(res.ok){
            const data = await res.json();
            console.log(`Transaction created: ${data}`);
            return data;
        }

    } catch (error) {
        console.log("error in creating transaction:", error);
    }
} 