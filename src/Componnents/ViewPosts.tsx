import React, { useEffect, useState } from "react";
import postService from "../Services/post_service";
import { useNavigate } from "react-router-dom";

interface Post {
  _id: string;
  title: string;
  content: string;
  senderUsername: string;
  image?: string;
  commentCount?: number;
  likes: number;
  likedUsernames?: string[];
}

const ViewPosts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await postService.getAllPosts();
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
    <div className="flex flex-col items-center min-h-screen bg-gray-50 py-10 px-4">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">All Reviews</h1>

      {error && <p className="text-red-500">{error}</p>}
        
      <div className="w-full max-w-3xl space-y-8">
        {posts.length === 0 ? (
          <p className="text-lg text-gray-600 text-center">No posts available yet.</p>
        ) : (
          posts.map((post) => {
            const imageUrl = post.image ? `http://localhost:3004${post.image}` : null;

            return (
              <div
                key={post._id}
                className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center text-center border border-gray-200"
              >
                {/* 📌 Image at the top, centered */}
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt="Post"
                    className="w-56 h-auto object-cover rounded-md mb-4"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                )}


                {/* 📌 Post Title */}
                <h2 className="text-2xl font-semibold text-gray-900">{post.title}</h2>

                {/* 📌 Post Content */}
                <p className="text-gray-700 text-md mt-3 leading-relaxed">{post.content}</p>

                {/* 📌 Username */}
                <p className="text-gray-500 italic mt-3">
                  By: <span className="font-medium text-gray-800">{post.senderUsername || "Unknown User"}</span>
                </p>

                {/* 📌 Likes Section */}
                {Array.isArray(post.likedUsernames) && post.likedUsernames.length > 0 ? (
                  <p className="text-sm text-gray-600 mt-2">
                    ❤️ Liked by: {post.likedUsernames.join(", ")}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500 mt-2">No likes yet.</p>
                )}

                {/* 📌 Buttons for Comments & Likes */}
                <div className="flex justify-center gap-4 mt-5">
                  <button
                    onClick={() => navigate(`/comments/${post._id}`)}
                    className="px-5 py-2 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-900 transition flex items-center gap-2"
                  >
                    💬 {post.commentCount || 0} Comments
                  </button>
                  <button
                    className="px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                    onClick={() => handleToggleLike(post._id)}
                  >
                    👍 {post.likes} Likes
                  </button>
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
