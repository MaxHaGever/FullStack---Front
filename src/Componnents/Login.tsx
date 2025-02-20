import { FC } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import userService from "../Services/user_service"; // Import the login service

const LoginSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
});

type FormData = z.infer<typeof LoginSchema>;

const Login: FC<{ setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>> }> = ({ setIsLoggedIn }) => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(LoginSchema) });

    const onSubmit = async (data: FormData) => {
      try {
        console.log("📤 Sending Login Request:", data);
        
        const response = await userService.login(data);
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        
        setIsLoggedIn(true); // ✅ Update state immediately
        window.dispatchEvent(new Event("storage")); // ✅ Notify App.tsx
        
        // ✅ Fetch and store username
        const userResponse = await userService.getUserProfile();
        console.log("✅ User logged in:", userResponse.data.username);
        
        alert(`Login successful! Welcome, ${userResponse.data.username}!`);
        navigate("/"); // Redirect to home
      } catch (error) {
        console.error("❌ Login failed:", error);
        alert("Login failed. Please check your credentials.");
      }
    };
    
    
    
      
  
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <form onSubmit={handleSubmit(onSubmit)} style={{ width: "400px", border: "2px solid black", padding: "10px", backgroundColor: "#C1BAAC", borderRadius: "5px" }}>
          <h1 style={{ textAlign: "center" }}>Login</h1>
          <div className="mb-3">
            <label>Email:</label>
            <input {...register("email")} type="text" className="form-control" />
            {errors.email && <p className="text-danger">{errors.email.message}</p>}
          </div>
          <div className="mb-3">
            <label>Password:</label>
            <input {...register("password")} type="password" className="form-control" />
            {errors.password && <p className="text-danger">{errors.password.message}</p>}
          </div>
          <button type="submit" className="btn btn-dark">Log In</button>
        </form>
      </div>
    );
  };
  
  export default Login;

  