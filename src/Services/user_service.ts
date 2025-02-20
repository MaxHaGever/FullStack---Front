import apiClient from "./api-client";

export interface User {
  _id?: string;
  username: string;
  password?: string;
  email: string;
  avatar?: string;
}

const register = (user: { username: string; password: string; email: string }) => {
  console.log("📤 Sending Register Request:", user);
  return apiClient.post<{ _id: string; email: string; username: string }>("/auth/register", user);
};

const login = (credentials: { email: string; password: string }) => {
  return apiClient.post("/auth/login", credentials)
    .then(response => {
      const { accessToken, refreshToken } = response.data;
      localStorage.setItem("accessToken", accessToken);  // Store token in localStorage
      localStorage.setItem("refreshToken", refreshToken);  // Store refresh token
      return response;
    });
};

const getUserProfile = () => {
  return apiClient.get<{ _id: string; email: string; username: string; avatar?: string }>(
    "/auth/profile",
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
    }
  );
};


const updateProfile = (userData: { userId: string; avatar?: string }) => {
  return apiClient.put("/auth/updateProfile", userData, {
    headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
  });
};


const logout = () => {
  console.log("📤 Sending Logout Request");
  return apiClient.post("/auth/logout", { refreshToken: localStorage.getItem("refreshToken") });
};

const uploadImage = (image: File) => {
  const formData = new FormData();
  formData.append("file", image);
console.log("📤 Sending Image Upload Request:", image);
  return apiClient.post<{ url: string }>("/file/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  console.log("📤 Sending Image Upload Request:", image);
};


export default { register, login, getUserProfile, updateProfile, logout , uploadImage};
