import {TESTING_URL} from "../ApiLinks"

export const createTransaction = async (transaction) => {
    try {
        const res = await fetch(`${TESTING_URL}/transaction/create`, {
            method: "POST",
            headers: {
                "Content-type": "Application/json"
            },
            body: JSON.stringify(transaction),
            credentials: "include"
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

export const deleteTransaction = async (transactionId) => {
    try {
        const res = await fetch(`${TESTING_URL}/transaction/delete`, {
            method: "DELETE",
            headers: {
                "Content-type": "Application/json"
            },
            body: JSON.stringify({id: transactionId}),
            credentials: "include"
        })

        if(res.ok){
            const data = await res.json();
            console.log(`Transaction deleted: ${data}`);
            return data;
        }

    } catch (error) {
        console.log("error in deleting transaction:", error);
    }
} 

export const updateTransaction = async (transaction) => {
    try {
        const res = await fetch(`${TESTING_URL}/transaction/update`, {
            method: "PATCH",
            headers: {
                "Content-type": "Application/json"
            },
            body: JSON.stringify(transaction),
            credentials: "include"
        })

        if(res.ok){
            const data = await res.json();
            console.log(`Transaction updated: ${data}`);
            return data;
        }

    } catch (error) {
        console.log("error in updating transaction:", error);
    }
} 

export const getAllTransactionsOfUser = async (credentials) => {
    try {
        const res = await fetch(`${TESTING_URL}/transaction/total-transactions`, {
            method: "GET",
            headers: {
                "Content-type": "Application/json"
            },
            body: JSON.stringify(credentials),
            credentials: "include"
        })

        if(res.ok){
            const data = await res.json();
            console.log(`All transactions of user: ${data}`);
            return data.transactions;
        }

    } catch (error) {
        console.log("error in getting all transactions of user:", error);
    }
} 