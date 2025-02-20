import { useEffect, useState } from "react";
import userService from "../Services/user_service";

// Helper function to fix avatar URL
const fixAvatarUrl = (url: string | undefined): string => {
  if (url && url.startsWith("http://localhost:3004uploads/")) {
    return url.replace("http://localhost:3004uploads/", "http://localhost:3004/uploads/"); // Fix URL
  }
  return url || "https://via.placeholder.com/150"; // Default placeholder
};

const ProfilePage = () => {
  const [user, setUser] = useState<{ _id?: string; username: string; email: string; avatar?: string }>({
    _id: "",
    username: "",
    email: "",
    avatar: "",
  });

  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);

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
    fetchUserProfile();
  }, []);

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

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <form
        onSubmit={(e) => e.preventDefault()}
        style={{
          width: "400px",
          border: "2px solid black",
          padding: "10px",
          margin: "10px",
          backgroundColor: "#C1BAAC",
          borderRadius: "5px",
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
          <input type="file" onChange={handleFileChange} />
        </div>

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
          <button onClick={handleUpdateProfile} className="btn btn-dark">Update Profile</button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
