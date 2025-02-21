import apiClient from "./api-client"; // ✅ Import API client

const getCommentsByPost = (postId: string) => {
    return apiClient.get(`/comments/post/${postId}`);
  };
  

  const addComment = (postId: string, text: string, token: string) => {
    return apiClient.post(
      "/comments",
      { postId, text },
      {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Send token for authentication
          "Content-Type": "application/json", // ✅ Ensure JSON format
        },
      }
    );
  };
  

const deleteComment = (commentId: string) => {
  const token = localStorage.getItem("accessToken"); // ✅ Get auth token
  if (!token) {
    throw new Error("Unauthorized: No token found");
  }

  return apiClient.delete(`/comments/${commentId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export default {
  getCommentsByPost,
  addComment,
  deleteComment,
};
