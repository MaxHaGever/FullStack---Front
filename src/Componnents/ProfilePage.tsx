import React from "react";

const ProfilePage: React.FC = () => {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      backgroundColor: "#C1BAAC",
    }}>
      <h1>👤 Your Profile</h1>
      <p>Welcome to your profile page!</p>
    </div>
  );
};

export default ProfilePage;
