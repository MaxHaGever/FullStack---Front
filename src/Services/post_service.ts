
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

const updatePostWithImage = async (postId: string, formData: FormData) => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    return Promise.reject(new Error("Unauthorized: No token found."));
  }

  return apiClient.put(`/posts/${postId}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data", 
    },
  });
};



const getMyPosts = async () => {
  const userId = localStorage.getItem("userId"); // ✅ Get userId from localStorage

  console.log("📤 Fetching My Posts: User ID", { userId }); // ✅ Debugging

  if (!userId) {
    console.error("❌ Missing user ID!", { userId });
    return Promise.reject(new Error("Unauthorized: No user ID found."));
  }

  return apiClient.get(`/posts/by-sender?sender=${userId}`); // ✅ No token required
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
const updatePost = async (postId: string, updatedData: { title?: string; content?: string }) => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    console.error("❌ Missing authentication token!");
    return Promise.reject(new Error("Unauthorized: No token found."));
  }

  console.log(`📤 Sending Update Request for Post: ${postId}`, updatedData);

  return apiClient.put(`/posts/${postId}`, updatedData, {
    headers: { Authorization: `Bearer ${token}` }, // ✅ Include token in headers
  })
  .then(response => {
    console.log(`✅ Post Updated Successfully:`, response.data);
    return response.data;
  })
  .catch(error => {
    console.error(`❌ Error updating post ${postId}:`, error);
    throw error;
  });
};

const toggleLike = async (postId: string) => {
  const token = localStorage.getItem("accessToken"); // ✅ Ensure token is sent
  if (!token) {
      throw new Error("Unauthorized: No token found");
  }

  return apiClient.post(`/posts/${postId}/like`, {}, {
      headers: {
          Authorization: `Bearer ${token}`,  // ✅ Send token in header
          "Content-Type": "application/json",
      }
  });
};


// Delete post
const deletePost = (postId: string) => {
  const token = localStorage.getItem("accessToken"); // ✅ Get token from storage
  if (!token) {
      return Promise.reject(new Error("No auth token found"));
  }

  return apiClient.delete(`/posts/${postId}`, {
      headers: {
          Authorization: `Bearer ${token}`, // ✅ Send auth token
      },
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
    toggleLike
};
