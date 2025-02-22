import { CredentialResponse } from "@react-oauth/google";
import apiClient from "./api-client";
import axios from "axios";

export interface User {
  _id?: string;
  username: string;
  password?: string;
  email: string;
  avatar?: string;
  accessToken?: string;
  refreshToken?: string;
}

const register = (user: { username: string; password: string; email: string }) => {
  console.log("📤 Sending Register Request:", user);
  return apiClient.post<{ _id: string; email: string; username: string }>("/auth/register", user);
};

const API_URL = "http://localhost:3004/auth";
const registerWithGoogle = async (credentialResponse: CredentialResponse) => {
  return axios.post(`${API_URL}/google`, { token: credentialResponse.credential });
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

const getUserById = async (userId: string) => {
  return apiClient.get(`/users/${userId}`);
};


export default { register, login, getUserProfile, updateProfile, logout , uploadImage, getUserById, registerWithGoogle};
