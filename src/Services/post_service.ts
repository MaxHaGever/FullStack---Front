import apiClient from "./api-client"; // This imports your configured API client instance (axios, fetch, etc.)

export interface IPost {
    _id: string;
    title: string;
    content: string;
    sender: string;
    image?: string; // Optional: image URL if provided
    likes: number;
    comments: string[]; // Array of comment IDs
}


const getAllPosts = () => {
  return apiClient.get("/posts");
};

const createPost = async (postData: FormData) => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    console.error("❌ Missing authentication token!");
    return Promise.reject(new Error("Unauthorized: No token found."));
  }

  console.log("📤 Sending Post Request with Headers:", {
    Authorization: `Bearer ${token}`,
    "Content-Type": "multipart/form-data",
  });

  return apiClient.post(`/posts`, postData, {
    headers: {
      "Authorization": `Bearer ${token}`, // ✅ Ensure token is included
      "Content-Type": "multipart/form-data",
    },
  });
};






// Get a post by ID
const getPostById = (postId: string) => {
    return apiClient.get<IPost>(`/posts/${postId}`);
};

// Like a post
const likePost = (postId: string) => {
    return apiClient.post(`/posts/${postId}/like`);
};

// Get posts by a specific user (sender)
const getPostsBySender = (senderId: string) => {
    return apiClient.get<IPost[]>(`/posts?sender=${senderId}`);
};

// Update post (if needed)
const updatePost = (postId: string, updatedData: { title?: string; content?: string }) => {
    return apiClient.put(`/posts/${postId}`, updatedData);
};

// Delete post
const deletePost = (postId: string) => {
    return apiClient.delete(`/posts/${postId}`);
};

export default {
    createPost,
    getAllPosts,
    getPostById,
    likePost,
    getPostsBySender,
    updatePost,
    deletePost,
};
