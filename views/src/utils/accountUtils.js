import {TESTING_URL} from "../ApiLinks"

export const createAccountUser = async (body) => {
    try {
        const res = await fetch(`${TESTING_URL}/account/create`, {
            method: "POST",
            headers: {
                "Content-type": "Application/json"
            },
            body: JSON.stringify(body)
        })

        if(res.ok){
            const data = await res.json();
            console.log(`Account created: ${data}`);
            return data;
        }

    } catch (error) {
        console.log("error in creating account:", error);
    }
} 