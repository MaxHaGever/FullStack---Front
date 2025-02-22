import apiClient from "./api-client";

export interface IPost {
  _id: string;
  title: string;
  content: string;
  sender: string;
  image?: string;
  likes: number;
  comments: string[];
}

const getAllPosts = () => apiClient.get("/posts");

const createPost = async (postData: FormData) => {
  const token = localStorage.getItem("accessToken");
  if (!token) return Promise.reject(new Error("Unauthorized: No token found."));

  return apiClient.post("/posts", postData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

const updatePostWithImage = async (postId: string, formData: FormData) => {
  const token = localStorage.getItem("accessToken");
  if (!token) return Promise.reject(new Error("Unauthorized: No token found."));

  return apiClient.put(`/posts/${postId}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

const getMyPosts = async () => {
  const userId = localStorage.getItem("userId");
  if (!userId) return Promise.reject(new Error("Unauthorized: No user ID found."));

  return apiClient.get(`/posts/by-sender?sender=${userId}`);
};

const getPostById = (postId: string) => apiClient.get<IPost>(`/posts/${postId}`);

const likePost = (postId: string) => apiClient.post(`/posts/${postId}/like`);

const getPostsBySender = (senderId: string) => apiClient.get<IPost[]>(`/posts?sender=${senderId}`);

const updatePost = async (postId: string, updatedData: { title?: string; content?: string }) => {
  const token = localStorage.getItem("accessToken");
  if (!token) return Promise.reject(new Error("Unauthorized: No token found."));

  return apiClient.put(`/posts/${postId}`, updatedData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const toggleLike = async (postId: string) => {
  const token = localStorage.getItem("accessToken");
  if (!token) return Promise.reject(new Error("Unauthorized: No token found."));

  return apiClient.post(`/posts/${postId}/like`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

const deletePost = async (postId: string) => {
  const token = localStorage.getItem("accessToken");
  if (!token) return Promise.reject(new Error("Unauthorized: No token found."));

  return apiClient.delete(`/posts/${postId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export default {
  createPost,
  getAllPosts,
  getPostById,
  likePost,
  getPostsBySender,
  updatePost,
  deletePost,
  getMyPosts,
  updatePostWithImage,
  toggleLike,
};
