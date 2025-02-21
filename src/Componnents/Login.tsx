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
          
          if (!response.data.accessToken || !response.data._id) { // ✅ Ensure userId exists
              console.error("❌ Login response is missing token or userId");
              alert("Error: Missing token or user ID.");
              return;
          }
  
          localStorage.setItem("accessToken", response.data.accessToken);
          localStorage.setItem("userId", response.data._id); // ✅ Store userId
          localStorage.setItem("username", response.data.username); // ✅ Store username
  
          setIsLoggedIn(true);
          window.dispatchEvent(new Event("storage")); 
          
          navigate("/profile"); 
      } catch (error) {
          console.error("❌ Login failed:", error);
          alert("Login failed. Please check your credentials.");
      }
  };
  
  
    
    
    
      
  
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <form onSubmit={handleSubmit(onSubmit)} style={{ width: "400px", padding: "10px", backgroundColor: "#C1BAAC", }}>
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
          <button type="submit" className="btn btn-dark" style={{
            width: "100%",
            marginTop: "10px",
          }}>Log In</button>
        </form>
      </div>
    );
  };
  
  export default Login;

  