import { useEffect, useState } from "react";
import userService from "../Services/user_service";
import { useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import postService from "../Services/post_service";

// Helper function to fix avatar URL
const fixAvatarUrl = (url: string | undefined): string => {
  if (url && url.startsWith("http://localhost:3004uploads/")) {
    return url.replace("http://localhost:3004uploads/", "http://localhost:3004/uploads/"); // Fix URL
  }
  return url || "https://via.placeholder.com/150"; // Default placeholder
};

const ProfilePage = () => {
  const inputFile = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<{ _id?: string; username: string; email: string; avatar?: string }>({
    _id: "",
    username: "",
    email: "",
    avatar: "",
  });

  const navigate = useNavigate();
  const [myPosts, setMyPosts] = useState<{ _id: string; title: string; content: string; image?: string }[]>([]);
  const [editingPost, setEditingPost] = useState<{ id: string; title: string; content: string } | null>(null);
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);
  const [error, setError] = useState<string>("");
  const [selectedPostImage, setSelectedPostImage] = useState<File | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await userService.getUserProfile();
        console.log("User fetched:", response.data); // Debug the full user data
        setUser(response.data);
        setNewUsername(response.data.username);
        setNewEmail(response.data.email);
      } catch (error) {
        console.error("❌ Error fetching user profile:", error);
      }
    };
    const fetchMyPosts = async () => {
      try {
        const response = await postService.getMyPosts();
        console.log("📥 My Posts:", response.data);
        setMyPosts(response.data);
      } catch (error) {
        setError("Failed to load your posts.");
        console.error("❌ Error fetching my posts:", error);
      }
    };
    fetchMyPosts();
    fetchUserProfile();
  }, []);

  const handlePostAPost = () => {
    navigate("/post-a-post"); // ✅ Ensure this is the correct route
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedAvatar(event.target.files[0]);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      let avatarUrl = user.avatar;

      if (selectedAvatar) {
        const uploadResponse = await userService.uploadImage(selectedAvatar);
        avatarUrl = uploadResponse.data.url;
      }

      if (!user._id) {
        console.error("❌ Error: User ID is missing!");
        alert("Error: Unable to update profile.");
        return;
      }

      const updatedData = {
        userId: user._id, // Ensure userId is included
        username: newUsername,
        email: newEmail,
        password: newPassword || undefined,
        avatar: avatarUrl,
      };

      await userService.updateProfile(updatedData);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("❌ Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  const handleEditPost = (postId: string, title: string, content: string) => {
    setEditingPost({ id: postId, title, content });
    setSelectedPostImage(null);
  };

  const handleDeletePost = async (postId: string) => {
    if (!window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
        return;
    }

    try {
        await postService.deletePost(postId);
        setMyPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
        alert("Post deleted successfully!");
    } catch (error) {
        console.error("❌ Failed to delete post:", error);
        alert("Failed to delete post.");
    }
};


  const handleUpdatePost = async () => {
    if (!editingPost) return;

    try {
      console.log(`📤 Sending update request for Post ID: ${editingPost.id}`);

      const formData = new FormData();
      formData.append("title", editingPost.title);
      formData.append("content", editingPost.content);

      if (selectedPostImage) {
        formData.append("image", selectedPostImage);
      }

      console.log("📤 Form Data Sent:", Object.fromEntries(formData.entries())); // ✅ Debugging

      const response = await postService.updatePostWithImage(editingPost.id, formData);

      if (!response || !response.data) {
        throw new Error("No response from server");
      }

      console.log(`✅ Post updated in backend:`, response.data);

      setMyPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === editingPost.id
            ? {
                ...post,
                title: response.data.title,
                content: response.data.content,
                image: response.data.image || post.image,
              }
            : post
        )
      );

      setEditingPost(null);
      setSelectedPostImage(null);
      alert("Post updated successfully!");
    } catch (error) {
      console.error("❌ Backend failed to update post:", error);
      alert("Failed to update post.");
    }
};





  

  return (
    <div style={{ 
      display: "flex", justifyContent: "center", alignItems: "center", 
      alignContent: "center",
      flexDirection: "column",
      }}>
      <form
        onSubmit={(e) => e.preventDefault()}
        style={{
          width: "400px",
          padding: "10px",
          margin: "10px",
          backgroundColor: "#C1BAAC",
        }}
      >
        <h1 style={{ textAlign: "center" }}>Profile</h1>

        {/* Avatar */}
        <div style={{ textAlign: "center" }}>
          <img
            src={fixAvatarUrl(user.avatar)} // Use helper function to fix the avatar URL
            alt="User Avatar"
            style={{ width: "150px", height: "150px", borderRadius: "50%" }}
          />
          <input ref={inputFile} type="file" onChange={handleFileChange} style={{
            display: "none",
          }} />
        </div>
        <FontAwesomeIcon icon={faImage} size='2x' onClick={() => inputFile.current?.click()} style={{
            cursor: "pointer",
            justifyContent: "center",
            display: "flex",
            margin: "auto",
            marginTop: "10px",
        }}/>
        {/* Username */}
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username:</label>
          <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            className="form-control"
            id="username"
          />
        </div>

        {/* Email */}
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email:</label>
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="form-control"
            id="email"
          />
        </div>

        {/* Password */}
        <div className="mb-3">
          <label htmlFor="password" className="form-label">New Password:</label>
          <input
            type="password"
            placeholder="Enter new password"
            onChange={(e) => setNewPassword(e.target.value)}
            className="form-control"
            id="password"
          />
        </div>

        {/* Update Button */}
        <div style={{ textAlign: "center" }}>
          <button onClick={handleUpdateProfile} className="btn btn-dark" style={{
            marginBottom: "10px",
            width: "50%",
          }}>Update Profile</button>
        </div>

        <div>
                <button
                    className="btn btn-dark"
                    onClick={handlePostAPost}
                    style={{
                        width: "50%",
                        marginTop: "10px",
                        justifyContent: "center",
                        display: "flex",
                        margin: "auto",
                    }}
                >
                    Post a Review
                </button>
            </div>
      </form>
      <div style={{ width: "400px", padding: "10px", backgroundColor: "#C1BAAC", }}>
      <h2 style={{
          textAlign: "center",
          marginBottom: "20px",
          color: "#333",
      }}>My Reviews</h2>
        {error && <p className="text-danger">{error}</p>}
        {myPosts.map((post) => (
          <div key={post._id} className="post-card" style={{ backgroundColor: "#fff", padding: "10px", borderRadius: "5px", marginBottom: "10px" }}>
            {editingPost && editingPost.id === post._id ? (
              <>
                <input
                  type="text"
                  value={editingPost.title}
                  onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                  className="form-control"
                />
                <textarea
                  value={editingPost.content}
                  onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                  className="form-control"
                  rows={3}
                />
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => setSelectedPostImage(e.target.files?.[0] || null)} 
                  className="form-control"
                />
                <button onClick={handleUpdatePost} className="btn btn-success" style={{ marginTop: "5px" }}>
                  Save
                </button>
                <button onClick={() => setEditingPost(null)} className="btn btn-secondary" style={{ marginTop: "5px", marginLeft: "5px" }}>
                  Cancel
                </button>
              </>
            ) : (
              <>
              <div style={{ 
                textAlign: "center",
                alignContent: "center",
                justifyContent: "center",
                display: "flex",
                flexDirection: "column",}}>
                <h3>{post.title}</h3>
                <p>{post.content}</p>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "10px" }}>
                {post.image && <img src={`http://localhost:3004${post.image}`} alt="Post" style={{ maxWidth: "150px", maxHeight: "400x"}} />}
                </div>
                <button onClick={() => handleEditPost(post._id, post.title, post.content)} className="btn btn-dark" style={{ marginTop: "5px" }}>
                  Edit Post
                </button>
                <button
  onClick={() => handleDeletePost(post._id)}
  className="btn btn-danger"
  style={{ marginTop: "5px" }}
>
  Delete Post
</button>
</div>
              </>
            )}
          </div>
        ))}
      </div>
      </div>
  );
};

export default ProfilePage;
