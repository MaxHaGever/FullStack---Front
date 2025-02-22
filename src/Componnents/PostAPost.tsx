import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import postService from "../Services/post_service"; 

interface PostAPostProps {
  isLoggedIn: boolean;
}

const PostAPost: React.FC<PostAPostProps> = ({ isLoggedIn }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState("");

  if (!isLoggedIn) {
    navigate("/login");
    return null;
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !content) {
      setError("Title and content are required.");
      return;
    }

    const username = localStorage.getItem("username");

    if (!username) {
      setError("Error: Unable to retrieve username.");
      return;
    }

    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("username", username);
    if (image) {
      postData.append("image", image);
    }

    try {
      await postService.createPost(postData);
      navigate("/view-posts");
    } catch {
      setError("Failed to create post. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form 
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white shadow-lg rounded-lg p-6"
      >
        <h1 className="text-2xl font-bold text-center mb-6">Create a Post</h1>

        <div className="mb-4">
          <label className="block text-gray-700">Post Title:</label>
          <input
            type="text"
            id="title"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Content:</label>
          <textarea
            id="content"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            required
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Post Image (optional):</label>
          <input
            type="file"
            id="image"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

        <button 
          type="submit" 
          className="w-full mt-6 bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition"
        >
          Submit Post
        </button>
      </form>
    </div>
  );
};

export default PostAPost;
