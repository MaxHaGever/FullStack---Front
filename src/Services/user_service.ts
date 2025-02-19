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

export default { register, uploadImage , updateProfile};
