import React, { useEffect, useState } from "react";
import postService from "../Services/post_service"; // Assuming you have postService for posts actions

interface Post {
  _id: string;
  title: string;
  content: string;
  sender: string;
  image?: string; // Optional image field
}

const ViewPosts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);  // Change to the new Post type
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await postService.getAllPosts(); // Call the service to fetch all posts
        setPosts(response.data); // Set the posts in state
      } catch (err) {
        setError("Failed to load posts.");
        console.error("❌ Error fetching posts:", err);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="container">
      <h1>All Posts</h1>

      {error && <p className="text-danger">{error}</p>}

      {/* Display all posts */}
      <div className="post-list">
        {posts.length === 0 ? (
          <p>No posts available yet.</p>
        ) : (
          posts.map((post) => (
            <div key={post._id} className="post-card">
              <h2>{post.title}</h2>
              <p>{post.content}</p>
              {post.image && <img src={post.image} alt="Post" style={{ width: "100%", maxHeight: "300px" }} />}
              <p>By: {post.sender}</p>
              <button>Comment</button> {/* Add comment functionality */}
              <button>Like</button> {/* Add like functionality */}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ViewPosts;
