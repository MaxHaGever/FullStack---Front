import { useEffect, useState } from "react";
import userService from "../Services/user_service";

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
              console.log("✅ User fetched:", response.data); // ✅ Check if avatar URL is correct
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
                userId: user._id, // ✅ Ensure userId is included
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
    
    console.log("Avatar URL:", user.avatar);
    return (
        
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h1>Profile</h1>

            {/* Avatar */}
            <div>
            <img 
  src={user.avatar || "https://via.placeholder.com/150"} 
  alt="User Avatar" 
  style={{ width: "150px", height: "150px", borderRadius: "50%" }} 
/>

                <input type="file" onChange={handleFileChange} />
            </div>

            {/* Username */}
            <div>
                <label>Username:</label>
                <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                />
            </div>

            {/* Email */}
            <div>
                <label>Email:</label>
                <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                />
            </div>

            {/* Password */}
            <div>
                <label>New Password:</label>
                <input
                    type="password"
                    placeholder="Enter new password"
                    onChange={(e) => setNewPassword(e.target.value)}
                />
            </div>

            {/* Update Button */}
            <button onClick={handleUpdateProfile} className="btn btn-primary">Update Profile</button>
        </div>
    );
};

export default ProfilePage;
