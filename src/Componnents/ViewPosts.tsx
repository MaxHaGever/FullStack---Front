import React, { useEffect, useState } from "react";
import postService from "../Services/post_service";

interface Post {
  _id: string;
  title: string;
  content: string;
  senderUsername: string; // ✅ Store username directly in the post
  image?: string;
}

const ViewPosts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await postService.getAllPosts();
        console.log("📥 Fetched Posts:", response.data);
        setPosts(response.data);
      } catch (err) {
        setError("Failed to load posts.");
        console.error("❌ Error fetching posts:", err);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <div
        style={{
          width: "600px",
          padding: "10px",
          margin: "10px",
          backgroundColor: "#C1BAAC",
          borderRadius: "10px",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
        }}
      >
        <h1 style={{ textAlign: "center" }}>All Posts</h1>

        {error && <p className="text-danger">{error}</p>}

        <div className="post-list">
          {posts.length === 0 ? (
            <p>No posts available yet.</p>
          ) : (
            posts.map((post) => {
              const imageUrl = post.image ? `http://localhost:3004${post.image}` : null;
              console.log(`🖼️ Post ID: ${post._id}, Image URL:`, imageUrl);

              return (
                <div key={post._id} className="post-card" style={{
                  backgroundColor: "#fff",
                  padding: "15px",
                  marginBottom: "15px",
                  borderRadius: "8px",
                  boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)"
                }}>
                  <h2 style={{ textAlign: "center", color: "#333" }}>{post.title}</h2>
                  <p style={{ color: "#555" }}>{post.content}</p>

                  {/* ✅ Display image if available */}
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt="Post"
                      style={{ width: "100%", maxHeight: "300px", objectFit: "cover", borderRadius: "5px" }}
                      onError={(e) => {
                        console.error(`❌ Failed to load image for post ${post._id}:`, e);
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  )}

                  {/* ✅ Display username instead of user ID */}
                  <p style={{ fontStyle: "italic", textAlign: "center" }}>
                    By: {post.senderUsername || "Unknown User"}
                  </p>

                  <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
                    <button className="btn btn-dark" style={{ marginRight: "5px" }}>Comment</button>
                    <button className="btn btn-dark">Like</button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewPosts;
