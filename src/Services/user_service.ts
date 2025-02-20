import apiClient, { CanceledError } from "./api-client";

export { CanceledError };

export interface User {
  _id?: string;
  username: string;
  password: string;
  email: string;
  avatar?: string;
}

const register = (user: { username: string; password: string; email: string }) => {
  console.log("📤 Sending Register Request:", user);
  
  // ✅ Remove `{ request }` and return the promise directly
  return apiClient.post<{ _id: string; email: string; username: string }>('/auth/register', user);
};


const uploadImage = (img: File) => {
  const formData = new FormData();
  formData.append("file", img);

  console.log("📤 Uploading image:", img.name);

  // ✅ Return the promise directly
  return apiClient.post<{ url: string }>("/file/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
  });
};


const updateProfile = (userId: string, avatarUrl: string) => {
  return apiClient.put(`/auth/updateProfile`, { userId, avatar: avatarUrl });
};

const login = (user: { email: string; password: string }) => {
  console.log("📤 Sending Login Request:", user);

  return apiClient.post<{ 
    email: string; 
    username: string; 
    _id: string; 
    accessToken: string; 
    refreshToken: string 
  }>('/auth/login', user);
};

const API_BASE_URL = "http://localhost:3004"; // ✅ Ensure backend URL is correct

const getUserProfile = () => {
  return apiClient.get<{ email: string; username: string; _id: string }>(
    `${API_BASE_URL}/auth/profile`,  // ✅ Ensure correct URL
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
    }
  );
};

export default { register, login, uploadImage, updateProfile, getUserProfile };




