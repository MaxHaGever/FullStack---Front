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

const API_URL = "http://localhost:3004/auth";

const register = (user: { username: string; password: string; email: string }) => {
  return apiClient.post<{ _id: string; email: string; username: string }>("/auth/register", user);
};

const registerWithGoogle = async (credentialResponse: CredentialResponse) => {
  return axios.post(`${API_URL}/google`, { token: credentialResponse.credential });
};

const login = async (credentials: { email: string; password: string }) => {
  const response = await apiClient.post("/auth/login", credentials);
  const { accessToken, refreshToken } = response.data;
  
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);

  return response;
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
  return apiClient.post("/auth/logout", { refreshToken: localStorage.getItem("refreshToken") });
};

const uploadImage = (image: File) => {
  const formData = new FormData();
  formData.append("file", image);

  return apiClient.post<{ url: string }>("/file/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

const getUserById = (userId: string) => {
  return apiClient.get(`/users/${userId}`);
};

export default { register, login, getUserProfile, updateProfile, logout, uploadImage, getUserById, registerWithGoogle };
