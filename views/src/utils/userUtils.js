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
            const data = await res.json();
            console.log(`Login data: ${data}`);
            return data;
        }

    } catch (error) {
        console.log("error at login:", error);
    }
}

export const logoutUser = async () => {
    try {
        const res = await fetch(`${TESTING_URL}/auth/logout`)

        if(res.ok){
            const data = await res.json();
            console.log(`User logged out succesfully`);
            return data;
        }

    } catch (error) {
        console.log("error at logout:", error);
    }
} 

export const registerUser = async (credentials) => {
    try {
        const res = await fetch(`${TESTING_URL}/user/register`, {
            method: "POST",
            headers: {
                "Content-type": "Application/json"
            },
            body: JSON.stringify(credentials)
        })

        if(res.ok){
            const data = await res.json();
            console.log(`Register data: ${data}`);
            return data;
        }

    } catch (error) {
        console.log("error at register:", error);
    }
} 


export const getUserDetails = async (credentials) => { //pending
    try {
        const res = await fetch(`${TESTING_URL}/user/dashboard`, {
            method: "POST",
            headers: {
                "Content-type": "Application/json"
            },
            body: JSON.stringify(credentials)
        })

        if(res.ok){
            const data = await res.json();
            console.log(`Register data: ${data}`);
            return data;
        }

    } catch (error) {
        console.log("error at register:", error);
    }
}

export const updateUserDetails = async (credentials) => { //pending
    try {
        const res = await fetch(`${TESTING_URL}/user/dashboard`, {
            method: "POST",
            headers: {
                "Content-type": "Application/json"
            },
            body: JSON.stringify(credentials)
        })

        if(res.ok){
            const data = await res.json();
            console.log(`Register data: ${data}`);
            return data;
        }

    } catch (error) {
        console.log("error at register:", error);
    }
} 