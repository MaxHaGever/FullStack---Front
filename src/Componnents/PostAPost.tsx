import React, { useEffect, useState } from "react";
import postService from "../Services/post_service"; // Assuming you have postService for posts actions

// types.ts (or wherever you prefer to define types)

export interface IComment {
    _id: string;
    text: string;
    sender: string;
    createdAt: string;
  }
  
  export interface IPost {
    _id: string;
    title: string;
    content: string;
    sender: string;
    image?: string;
    comments: IComment[];
    createdAt: string;
    updatedAt: string;
  }
  

const ViewPosts: React.FC = () => {
  const [posts, setPosts] = useState<IPost[]>([]); // Use IPost type here
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
          posts.map((post: IPost) => (
            <div key={post._id} className="post-card">
              <h2>{post.title}</h2>
              <p>{post.content}</p>
              {post.image && <img src={post.image} alt="Post" style={{ width: "100%", maxHeight: "300px" }} />}
              <p>By: {post.sender}</p>
              <div className="comments">
                {post.comments && post.comments.length > 0 ? (
                  <ul>
                    {post.comments.map((comment: IComment) => (
                      <li key={comment._id}>
                        <p>{comment.text}</p>
                        <p><em>By: {comment.sender}</em></p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No comments yet.</p>
                )}
              </div>
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
