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

  // Redirect if the user is not logged in
  if (!isLoggedIn) {
    navigate("/login");
    return null;
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]); // ✅ Store selected file
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !content) {
        setError("Title and content are required.");
        return;
    }

    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    if (image) {
        postData.append("image", image);
    }

    console.log("📤 Sending Post Data:", Object.fromEntries(postData.entries())); // ✅ Debugging

    try {
        await postService.createPost(postData);
        navigate("/profile");
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
            onChange={handleImageChange} // ✅ Handle image selection
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
