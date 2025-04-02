import { TESTING_URL } from "../ApiLinks"

export const getCategories = async () => { 
    try {
        const res = await fetch(`${TESTING_URL}/category`, {credentials:"include"});
        
        if(res.ok){
            const data = await res.json();
            console.log(data);
            return data.categories;
        }
        
    } catch (error) {
        console.log("Something went wrong while fetching categories", error);
    }
}