import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import commentService from "../Services/comment_service"; // ✅ Import comment service

interface Comment {
  _id: string;
  text: string;
  sender: string; // ✅ Username of the person who commented
  createdAt: string;
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
    if (!newComment || !postId) return;
    
    try {
      const response = await commentService.addComment(postId, newComment);
      setComments([...comments, response.data]); // ✅ Update comment list
      setNewComment(""); // ✅ Clear input after submitting
    } catch (err) {
      console.error("❌ Error adding comment:", err);
      setError("Failed to add comment.");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minHeight: "100vh" }}>
      <h1 style={{ marginBottom: "20px", color: "#333" }}>Comments</h1>

      {error && <p className="text-danger">{error}</p>}

      <div className="comment-list" style={{ width: "70%", maxWidth: "600px" }}>
        {comments.length === 0 ? (
          <p style={{ textAlign: "center", fontSize: "18px", color: "#555" }}>No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="comment-card" style={{
              backgroundColor: "#fff",
              padding: "15px",
              marginBottom: "10px",
              borderRadius: "8px",
              boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
            }}>
              <p style={{ fontWeight: "bold", marginBottom: "5px" }}>{comment.sender}</p>
              <p style={{ color: "#555", marginBottom: "5px" }}>{comment.text}</p>
              <p style={{ fontSize: "12px", color: "#777" }}>Posted on: {new Date(comment.createdAt).toLocaleString()}</p>
            </div>
          ))
        )}
      </div>

      {/* ✅ Add Comment Section */}
      <div style={{ width: "70%", maxWidth: "600px", marginTop: "20px" }}>
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
