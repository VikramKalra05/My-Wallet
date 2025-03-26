import { TESTING_URL } from "../ApiLinks"

export const createAccount = async (account) => {
    try{
        const res = await fetch(`${TESTING_URL}/account/create`, {
            method: "POST",
            headers: {
                "Content-type" : "Application/json"
            },
            body: JSON.stringify(account),
            credentials: "include"
        })

        if(res.ok){
            const data = await res.json();
            console.log(`Account created: ${data}`);
            return data.account;
        }else{
            return null
        }

    } catch (error) {   
        return null
    }
}

export const deleteAccount = async (account) => {
    console.log(account);
    try{
        const res = await fetch(`${TESTING_URL}/account/delete`, {
            method: "DELETE",
            headers: {
                "Content-type" : "Application/json"
            },
            body: JSON.stringify(account),
            credentials: "include"
        })

        if(res.ok){
            const data = await res.json();
            console.log(`Account deleted: ${data}`);
            return data.account;
        }else{
            return null
        }

    } catch (error) {   
        return null
    }
}

export const getAccounts=async()=>{
    try{
        const res=await fetch(`${TESTING_URL}/account/all`,{
        method :"GET",
        headers:{
            "Content-type":"Application/json"
        },
        credentials:"include"
    })
    if(res.ok){
        const data=await res.json()
        console.log(data)
        return data;
    }
    } catch (error) {
        return null
    }
}

export const editAccount=async(account)=>{
    try{
        const res=await fetch(`${TESTING_URL}/account/update`,{
        method :"PATCH",
        headers:{
            "Content-type":"Application/json"
        },
        body:JSON.stringify(account),
        credentials:"include"
    })
    if(res.ok){
        const data=await res.json()
        console.log(data)
        return data;
    }
    } catch (error) {
        return null
    }
}


// implement get Accounts for a user
// http://localhost:8080/api/v1/account/all
// return the accounts array