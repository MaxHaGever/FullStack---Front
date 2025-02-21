import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import commentService from "../Services/comment_service"; // ✅ Import comment service

interface Comment {
    _id: string;
    text: string;
    sender: { username: string }; // ✅ Change sender type
  }
  
  

const ViewComments: React.FC = () => {
  const { postId } = useParams<{ postId: string }>(); // ✅ Get postId from URL
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        if (postId) {
          const response = await commentService.getCommentsByPost(postId);
          console.log("📥 Fetched Comments:", response.data);
          setComments(response.data);
        } else {
          setError("Post ID is undefined.");
        }
      } catch (err) {
        setError("Failed to load comments.");
        console.error("❌ Error fetching comments:", err);
      }
    };
    fetchComments();
  }, [postId]);

  const handleAddComment = async () => {
    if (!newComment || !postId) {
      setError("Comment text is required.");
      return;
    }
  
    const token = localStorage.getItem("accessToken"); // ✅ Get JWT token
    if (!token) {
      console.error("❌ Missing authentication token");
      setError("You must be logged in to comment.");
      return;
    }
  
    try {
      console.log("📤 Sending Comment Data:", { postId, text: newComment });
  
      const response = await commentService.addComment(postId, newComment, token); // ✅ Send token
  
      console.log("✅ Comment Created Successfully:", response.data);
  
      setComments([...comments, response.data]); // ✅ Update comment list
      setNewComment(""); // ✅ Clear input after submitting
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("❌ Error adding comment:", err.message);
      } else {
        console.error("❌ Error adding comment:", err);
      }
      setError("Failed to add comment.");
    }
  };
  
  
  
  
  
  
  

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minHeight: "100vh" }}>
      <h1 style={{ marginBottom: "20px", color: "#333" }}>Comments</h1>

      {error && <p className="text-danger">{error}</p>}

      <div className="comment-list" style={{ width: "300%", maxWidth: "600px" }}>
        {comments.length === 0 ? (
          <p style={{ textAlign: "center", fontSize: "18px", color: "#555"}}>No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="comment-card" style={{
              backgroundColor: "#fff",
              padding: "15px",
              marginBottom: "10px",
              borderRadius: "8px",
              boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
            }}>
              <p style={{ fontWeight: "bold", marginBottom: "5px" }}>{comment.sender?.username}</p>
              <p style={{ color: "#555", marginBottom: "5px" }}>{comment.text}</p>
            </div>
          ))
        )}
      </div>

      {/* ✅ Add Comment Section */}
      <div style={{ width: "300%", maxWidth: "600px", marginTop: "20px" }}>
        <h3>Add a Comment</h3>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write your comment..."
          className="form-control"
          rows={3}
        ></textarea>
        <button onClick={handleAddComment} className="btn btn-dark" style={{ marginTop: "10px" }}>Submit</button>
      </div>
    </div>
  );
};

export default ViewComments;
