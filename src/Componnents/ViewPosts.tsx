import React, { useEffect, useState } from "react";
import postService from "../Services/post_service";
import { useNavigate } from "react-router-dom";

interface Post {
  _id: string;
  title: string;
  content: string;
  senderUsername: string; // ✅ Store username directly in the post
  image?: string;
  commentCount?: number; // ✅ New field to store comment count
    likes: number;
    likedUsernames?: string[]; // ✅ Store liked usernames
}

const ViewPosts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

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

  const handleToggleLike = async (postId: string) => {
    try {
        const response = await postService.toggleLike(postId);
        setPosts(posts.map(post =>
            post._id === postId ? { ...post, likes: response.data.likes } : post
        ));
    } catch (err) {
        console.error("❌ Error toggling like:", err);
    }
};

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", flexDirection: "column" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px", color: "#333" }}>All Reviews</h1>

      {error && <p className="text-danger">{error}</p>}

      <div className="post-list" style={{ width: "100%", maxWidth: "900px" }}> {/* ✅ Wider Cards */}
        {posts.length === 0 ? (
          <p style={{ textAlign: "center", fontSize: "18px", color: "#555" }}>No posts available yet.</p>
        ) : (
          posts.map((post) => {
            const imageUrl = post.image ? `http://localhost:3004${post.image}` : null;
            console.log(`🖼️ Post ID: ${post._id}, Image URL:`, imageUrl);

            return (
              <div key={post._id} className="post-card" style={{
                backgroundColor: "#fff",
                padding: "20px",
                marginBottom: "20px",
                borderRadius: "10px",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                textAlign: "center", // ✅ Centered content
              }}>
                {/* ✅ Image is now at the top, smaller size */}
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt="Post"
                    style={{ width: "100%", maxHeight: "400px", maxWidth: "150px", objectFit: "cover", borderRadius: "8px", marginBottom: "10px" }}
                    onError={(e) => {
                      console.error(`❌ Failed to load image for post ${post._id}:`, e);
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                )}

                <h2 style={{ color: "#222", fontSize: "22px", marginBottom: "10px" }}>{post.title}</h2>
                <p style={{ color: "#222", fontSize: "16px", marginBottom: "10px" }}>{post.content}</p>

                {/* ✅ Display username centered */}
                <p style={{ fontStyle: "italic", color: "#777", marginBottom: "15px" }}>
                  By: {post.senderUsername || "Unknown User"}
                </p>
                {Array.isArray(post.likedUsernames) && post.likedUsernames.length > 0 ? (
  <p style={{ fontSize: "14px", color: "#777", marginBottom: "10px" }}>
    ❤️ Liked by: {post.likedUsernames.join(", ")}
  </p>
) : (
  <p style={{ fontSize: "14px", color: "#777", marginBottom: "10px" }}>
    No likes yet.
  </p>
)}
                {/* ✅ Display comment count and likes */}
                <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                <button onClick={() => navigate(`/comments/${post._id}`)} className="btn btn-dark">({post.commentCount || 0}) Comments</button> {/* ✅ Navigate to comments page */}
                  <button className="btn btn-dark" onClick={() => handleToggleLike(post._id)} >👍 {post.likes} Likes</button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ViewPosts;
