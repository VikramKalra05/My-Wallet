import { TESTING_URL } from "../ApiLinks";

export const loginUser = async (credentials) => {
  try {
    const res = await fetch(`${TESTING_URL}/user/login`, {
      method: "POST",
      headers: {
        "Content-type": "Application/json",
      },
      body: JSON.stringify(credentials),
      credentials: "include"
    });

    if (res.ok) {
      const data = await res.json();
      console.log(`Login data: ${data}`);
      return data;
    }
  } catch (error) {
    console.log("error at login:", error);
  }
};

export const logoutUser = async () => {
  try {
    const res = await fetch(`${TESTING_URL}/auth/logout`);

    if (res.ok) {
      const data = await res.json();
      console.log(`User logged out succesfully`);
      return data;
    }
  } catch (error) {
    console.log("error at logout:", error);
  }
};

export const registerUser = async (credentials) => {
  try {
    const res = await fetch(`${TESTING_URL}/user/register`, {
      method: "POST",
      headers: {
        "Content-type": "Application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (res.ok) {
      const data = await res.json();
      console.log(`Register data: ${data}`);
      return data;
    }
  } catch (error) {
    console.log("error at register:", error);
  }
};

export const getUserDetails = async () => {
  try {
    const res = await fetch(`${TESTING_URL}/user/dashboard`, {
      method: "GET",
      headers: {
        "Content-type": "Application/json",
      },
      credentials: "include",
    });

    if (res.ok) {
      const data = await res.json();
      console.log(`User data: ${data}`);
      return data;
    }
  } catch (error) {
    console.log("error at fetching user details:", error);
  }
};

export const updateUserDetails = async (formData) => {
  try {
    const res = await fetch(`${TESTING_URL}/user/update`, {
      method: "PATCH",
      body: formData,
      credentials: "include",
    });

    if (res.ok) {
      const data = await res.json();
      console.log(`Updated User data: ${data}`);
      return data;
    }
  } catch (error) {
    console.log("error at updating user details:", error);
  }
};
