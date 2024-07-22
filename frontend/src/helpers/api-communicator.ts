import axios from "axios";

export const loginUser = async (email: string, password: string) => {
  const res = await axios.post("/user/login", { email, password });
  if (res.status !== 200) {
    throw new Error("Unable to login");
  }
  const data = await res.data;
  return data;
};

export const signupUser = async (
  firstName: string,
  lastName: string,
  age: number,
  eikenLevel: number,
  email: string,
  password: string
) => {
  // Logging input data for debugging purposes
  console.log(firstName, lastName, age, eikenLevel, email, password);

  const credentials = { 
    firstName, 
    lastName, 
    age, 
    eikenLevel, 
    email, 
    password
  };

  // Logging the payload for debugging purposes
  console.log('Sending credentials:', credentials);

  const res = await axios.post("/user/signup", credentials);
  if (res.status !== 201) {
    throw new Error("Unable to Signup");
  }
  const data = await res.data;
  return data;
};

export const checkAuthStatus = async () => {
  const res = await axios.get("/user/auth-status");
  if (res.status !== 200) {
    throw new Error("Unable to authenticate");
  }
  const data = await res.data;
  return data;
};

export const sendChatRequest = async (message: string) => {
  const res = await axios.post("/chat/new", { message });
  if (res.status !== 200) {
    throw new Error("Unable to send chat");
  }
  const data = await res.data;
  return data;
};

export const getUserChats = async () => {
  const res = await axios.get("/chat/all-chats");
  if (res.status !== 200) {
    throw new Error("Unable to get chats");
  }
  const data = await res.data;
  return data;
};

export const deleteUserChats = async () => {
  const res = await axios.delete("/chat/delete");
  if (res.status !== 200) {
    throw new Error("Unable to delete chats");
  }
  const data = await res.data;
  return data;
};

export const logoutUser = async () => {
  const res = await axios.get("/user/logout");
  if (res.status !== 200) {
    throw new Error("Unable to logout");
  }
  const data = await res.data;
  return data;
};

export const setUserLevel = async (level: number) => {
  const res = await axios.post("/user/setlevel", { level });
  if (res.status !== 200) {
    throw new Error("Unable to set level");
  }
  const data = await res.data;
  return data;
}