import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import postService from "../Services/post_service"; // Assuming you created postService for the post actions
import { useAuthContext } from "../Componnents/AuthContext"; // A context to get the user login state

const PostAPost = () => {
    const navigate = useNavigate();
    const { isLoggedIn, userId } = useAuthContext(); // Assume we have a context providing login state and user ID
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [image, setImage] = useState<File | undefined>(undefined); // Change File | null to File | undefined
    const [error, setError] = useState<string>("");

    // Redirect if the user is not logged in
    if (!isLoggedIn) {
        navigate("/login");
        return null;
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setImage(e.target.files[0]);
        } else {
            setImage(undefined); // Ensure image is undefined when no file is selected
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !content) {
            setError("Title and content are required.");
            return;
        }

        // Prepare post data and include userId
        const postData = {
            title,
            content,
            image, // This will be either the selected image or undefined
            sender: userId, // Include the userId in postData
        };

        try {
            await postService.createPost(postData); // Now we pass only one argument
            navigate("/profile"); // Redirect to profile or posts page after successful post creation
        } catch (err) {
            console.error("Error creating post:", err);
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
                        onChange={handleImageChange}
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
