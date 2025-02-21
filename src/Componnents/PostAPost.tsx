import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import postService from "../Services/post_service"; 

interface PostAPostProps {
  isLoggedIn: boolean;
  userId: string;
}

const PostAPost: React.FC<PostAPostProps> = ({ isLoggedIn }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  // Redirect if the user is not logged in
  if (!isLoggedIn) {
    navigate("/login");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!title || !content) {
      setError("Title and content are required.");
      return;
    }
  
    const postData = { title, content }; // ✅ Matches Swagger
  
    try {
      await postService.createPost(postData);
      navigate("/profile"); // ✅ Redirect after successful post
    } catch {
      setError("Failed to create post. Please try again.");
    }
  };
  
  

  return (
    <div className="container">
      <h1>Create a Post</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Post Title</label>
          <input
            type="text"
            id="title"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="content" className="form-label">Content</label>
          <textarea
            id="content"
            className="form-control"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            required
          ></textarea>
        </div>

        <div className="mb-3">
          <label htmlFor="image" className="form-label">Post Image (optional)</label>
          <input
            type="file"
            id="image"
            className="form-control"
            accept="image/*"
          />
        </div>

        {error && <p className="text-danger">{error}</p>}

        <button type="submit" className="btn btn-primary">
          Submit Post
        </button>
      </form>
    </div>
  );
};

export default PostAPost;
