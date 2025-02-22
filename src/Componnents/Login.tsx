import { FC } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import userService from "../Services/user_service";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";

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

      if (!response.data.accessToken || !response.data._id) {
        console.error("❌ Login response is missing token or userId");
        alert("Error: Missing token or user ID.");
        return;
      }

      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("userId", response.data._id);
      localStorage.setItem("username", response.data.username);

      setIsLoggedIn(true);
      window.dispatchEvent(new Event("storage"));
      navigate("/profile"); 
    } catch (error) {
      console.error("❌ Login failed:", error);
      alert("Login failed. Please check your credentials.");
    }
  };

const onGoogleLoginSuccess = async (credentialResponse: CredentialResponse) => {
  console.log("🟢 Google Login Success:", credentialResponse);

  try {
    // Send the Google token to the backend
    const res = await userService.registerWithGoogle(credentialResponse);

    console.log("✅ Backend Google Register Response:", res.data);

    // Store the JWT access token from backend
    localStorage.setItem("accessToken", res.data.accessToken);
    localStorage.setItem("refreshToken", res.data.refreshToken);
    localStorage.setItem("userId", res.data._id); // Store user ID for profile retrieval

    alert("🎉 Google Login Successful!");

    // Redirect user to profile page
    navigate(`/profile/${res.data._id}`);
  } catch (error) {
    console.error("❌ Error during Google login:", error);
    alert("Google login failed, please try again.");
  }
};

  const onGoogleLoginFailure = () => {
    console.error("❌ Google Login Failure:");
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form 
        onSubmit={handleSubmit(onSubmit)} 
        className="w-full max-w-md bg-white shadow-md rounded-lg p-6"
      >
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
        
        {/* Email Input */}
        <div className="mb-4">
          <label className="block text-gray-700">Email:</label>
          <input 
            {...register("email")} 
            type="text" 
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>

        {/* Password Input */}
        <div className="mb-4">
          <label className="block text-gray-700">Password:</label>
          <input 
            {...register("password")} 
            type="password" 
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Log In
        </button>
        <GoogleLogin onSuccess={onGoogleLoginSuccess} onError={onGoogleLoginFailure} />
      </form>
    </div>
  );
};

export default Login;
