import React, { useEffect, useState } from "react";
import postService from "../Services/post_service"; // Import the post service

interface Post {
  _id: string;
  title: string;
  content: string;
  sender: string;
  image?: string; // Optional image field
}

const ViewPosts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await postService.getAllPosts();
        console.log("📥 Fetched Posts:", response.data); // ✅ Log fetched posts
        setPosts(response.data);
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

      <div className="post-list">
        {posts.length === 0 ? (
          <p>No posts available yet.</p>
        ) : (
          posts.map((post) => {
            if (!post.image || post.image === "null") {
              console.warn(`⚠️ No image for post ${post._id}`);
            }
            const imageUrl = post.image && post.image !== "null" ? `http://localhost:3004${post.image}` : null;

            console.log(`🖼️ Post ID: ${post._id}, Image URL:`, imageUrl);

            return (
              <div key={post._id} className="post-card">
                <h2>{post.title}</h2>
                <p>{post.content}</p>

                {post.image && (
  <img 
    src={`http://localhost:3004${post.image}`} // ✅ Updated path
    alt="Post"
    style={{ width: "100%", maxHeight: "300px", objectFit: "cover" }} 
    onError={(e) => {
      console.error(`❌ Failed to load image for post ${post._id}:`, e);
      (e.target as HTMLImageElement).style.display = "none"; // Hide broken images
    }}
  />
)}

                <p>By: {post.sender}</p>
                <button>Comment</button>
                <button>Like</button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ViewPosts;
