import {TESTING_URL} from "../ApiLinks"

export const loginUser = async (credentials) => {
    try {
        const res = await fetch(`${TESTING_URL}/user/login`, {
            method: "POST",
            headers: {
                "Content-type": "Application/json"
            },
            body: JSON.stringify(credentials)
        })

        if(res.ok){
            const data = res.json();
            console.log(`Login data: ${data}`);
            return data;
        }

    } catch (error) {
        console.log("error at login:", error);
    }
} 