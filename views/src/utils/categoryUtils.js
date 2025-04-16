import { TESTING_URL } from "../ApiLinks";

export const getCategories = async () => {
  try {
    const res = await fetch(`${TESTING_URL}/category`, {
      credentials: "include",
    });

    if (res.ok) {
      const data = await res.json();
      console.log(data);
      return data.categories;
    }
  } catch (error) {
    console.log("Something went wrong while fetching categories", error);
  }
};

export const updateSubCategory = async (catId, subId, subcategory) => {
  try {
    const res = await fetch(
      `${TESTING_URL}/category/update/${catId}/${subId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify(subcategory), // subcategory = {subCategoryName}
        credentials: "include",
      }
    );

    if (res.ok) {
      const data = await res.json();
      console.log(data);
      return data;
    }
  } catch (error) {
    return null;
  }
};

export const deleteSubCategory = async (catId,subId) => {
  try {
    const res = await fetch(
      `${TESTING_URL}/category/delete/${catId}/${subId}`,
      {
        method: "DELETE",
        headers: {
          "Content-type": "Application/json",
        },
        credentials: "include",
      }
    );
    if (res.ok) {
      const data = await res.json();
      console.log(`Subcategory deleted: ${data}`);
      return data.category;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

export const addSubcategory=async(subcategory,catId)=>{
    try {
        const res=await fetch(`${TESTING_URL}/category/create/${catId}`,{
            method:"POST",
            headers:{
                "Content-type":"Application/json",
            },
            credentials:"include",
            body:JSON.stringify(subcategory)
        })
        if(res.ok){
            const data=await res.json()
            return data.category
        }
        
    } catch (error) {
        return null
        
    }
}