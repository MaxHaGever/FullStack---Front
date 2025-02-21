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
    navigate("/post-a-post"); // Ensure this is the correct route
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
      const formData = new FormData();
      formData.append("title", editingPost.title);
      formData.append("content", editingPost.content);

      if (selectedPostImage) {
        formData.append("image", selectedPostImage);
      }

      const response = await postService.updatePostWithImage(editingPost.id, formData);

      if (!response || !response.data) {
        throw new Error("No response from server");
      }

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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {/* Profile Section */}
      <form
        onSubmit={(e) => e.preventDefault()}
        className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 mb-8"
      >
        <h1 className="text-2xl font-bold text-center mb-6">Profile</h1>

        {/* Avatar */}
        <div className="flex justify-center items-center mb-4">
          <img
            src={fixAvatarUrl(user.avatar)} // Use helper function to fix the avatar URL
            alt="User Avatar"
            className="w-32 h-32 rounded-full border border-gray-300"
          />
          <input ref={inputFile} type="file" onChange={handleFileChange} className="hidden" />
        </div>
        <FontAwesomeIcon
          icon={faImage}
          size="2x"
          onClick={() => inputFile.current?.click()}
          className="text-gray-500 cursor-pointer hover:text-gray-700 transition"
        />
        
        {/* Username */}
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700">Username:</label>
          <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            id="username"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700">Email:</label>
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            id="email"
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700">New Password:</label>
          <input
            type="password"
            placeholder="Enter new password"
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            id="password"
          />
        </div>

        {/* Update Button */}
        <div className="text-center">
          <button
            onClick={handleUpdateProfile}
            className="w-full mt-6 bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition"
          >
            Update Profile
          </button>
        </div>

        {/* Post a Review Button */}
        <div className="mt-4">
          <button
            onClick={handlePostAPost}
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition"
          >
            Post a Review
          </button>
        </div>
      </form>

      {/* My Reviews Section (Positioned Below the Profile Section) */}
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-bold text-center mb-6">My Reviews</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {myPosts.map((post) => (
          <div key={post._id} className="bg-white shadow-lg rounded-lg p-4 mb-4">
            {editingPost && editingPost.id === post._id ? (
              <>
                <input
                  type="text"
                  value={editingPost.title}
                  onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                  className="w-full p-2 mb-2 border rounded-md"
                />
                <textarea
                  value={editingPost.content}
                  onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                  className="w-full p-2 mb-2 border rounded-md"
                  rows={3}
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelectedPostImage(e.target.files?.[0] || null)}
                  className="w-full p-2 mb-2 border rounded-md"
                />
                <button
                  onClick={handleUpdatePost}
                  className="w-full bg-blue-600 text-white py-3 rounded-md mt-2 hover:bg-blue-700 transition"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingPost(null)}
                  className="w-full bg-gray-500 text-white py-3 rounded-md mt-2 hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold">{post.title}</h3>
                <p>{post.content}</p>
                {post.image && <img src={`http://localhost:3004${post.image}`} alt="Post" className="mt-2 max-w-full h-auto" />}
                <div className="mt-4 flex justify-between">
                  <button
                    onClick={() => handleEditPost(post._id, post.title, post.content)}
                    className="bg-blue-600 text-white py-3 px-4 rounded-md w-full hover:bg-blue-700 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeletePost(post._id)}
                    className="bg-red-600 text-white py-3 px-4 rounded-md w-full hover:bg-red-700 transition"
                  >
                    Delete
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
