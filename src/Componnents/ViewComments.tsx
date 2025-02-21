import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import commentService from "../Services/comment_service";

interface Comment {
  _id: string;
  text: string;
  sender: { username: string };
}

const ViewComments: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        if (postId) {
          const response = await commentService.getCommentsByPost(postId);
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

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;

    try {
      await commentService.deleteComment(commentId);
      setComments((prevComments) => prevComments.filter((comment) => comment._id !== commentId));
    } catch (err) {
      console.error("❌ Error deleting comment:", err);
      alert("Failed to delete comment.");
    }
  };

  const handleAddComment = async () => {
    if (!newComment || !postId) {
      setError("Comment text is required.");
      return;
    }

    const token = localStorage.getItem("accessToken");
    if (!token) {
      setError("You must be logged in to comment.");
      return;
    }

    try {
      const response = await commentService.addComment(postId, newComment, token);
      setComments([...comments, response.data]);
      setNewComment("");
    } catch (err) {
      setError("Failed to add comment.");
      console.error("❌ Error adding comment:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 px-6">
      
      {/* Title */}
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Comments</h1>

      {/* Error Message */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Comment List (Now Much Wider) */}
      <div className="w-full max-w-5xl bg-white shadow-md rounded-lg p-6">
        {comments.length === 0 ? (
          <p className="text-center text-gray-500">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="bg-gray-100 p-4 rounded-lg mb-3 shadow-sm">
              <p className="font-semibold text-gray-800">{comment.sender?.username}</p>
              <p className="text-gray-700">{comment.text}</p>
              {comment.sender?.username === localStorage.getItem("username") && (
                <button
                  onClick={() => handleDeleteComment(comment._id)}
                  className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                >
                  Delete
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add Comment Section (Now Much Wider) */}
      <div className="w-full max-w-5xl bg-white shadow-md rounded-lg p-6 mt-6">
        <h3 className="text-lg font-semibold text-gray-800">Add a Comment</h3>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write your comment..."
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          rows={4}
        ></textarea>
        <button
          onClick={handleAddComment}
          className="w-full mt-4 bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </div>

    </div>
  );
};

export default ViewComments;
