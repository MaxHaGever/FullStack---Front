import { FC, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import pngegg from "../assets/pngegg.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import userService from "../Services/user_service";

const UserSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters long" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
  email: z.string().email({ message: "Invalid email" }),
});

type FormData = z.infer<typeof UserSchema>;

interface UserFormProps {
  setIsLoggedIn: (loggedIn: boolean) => void; // ✅ Accept setIsLoggedIn prop
}

const UserForm: FC<UserFormProps> = ({ setIsLoggedIn }) => {

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const inputFile = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(UserSchema),
  });

  const onFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) setSelectedImage(event.target.files[0]);
  };

  const onSubmit = async (data: FormData) => {
    try {
      const userPayload = { username: data.name, password: data.password, email: data.email };
      const registerResponse = await userService.register(userPayload);
      const userId = registerResponse.data._id ?? "";
  
      if (!userId) {
        alert("Registration successful, but user ID is missing.");
        return;
      }
  
      // ✅ Log the user in immediately after registration
      const loginResponse = await userService.login({ email: data.email, password: data.password });
  
      if (!loginResponse.data.accessToken) {
        alert("Login failed after registration.");
        return;
      }
  
      // ✅ Store login details in localStorage
      localStorage.setItem("accessToken", loginResponse.data.accessToken);
      localStorage.setItem("userId", userId);
      localStorage.setItem("username", registerResponse.data.username);
  
      // ✅ Update navbar state immediately
      setIsLoggedIn(true); 
      window.dispatchEvent(new Event("storage")); // ✅ Notify navbar about login
  
      // ✅ Upload profile image if selected
      if (selectedImage) {
        const uploadResponse = await userService.uploadImage(selectedImage);
        await userService.updateProfile({ userId, avatar: uploadResponse.data.url });
      }
  
      // ✅ Navigate to profile page
      navigate(`/profile`);
    } catch {
      alert("Registration failed. Please try again.");
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Register</h1>

        <div className="mb-4">
          <label className="block text-gray-700">Username:</label>
          <input 
            {...register("name")} 
            type="text" 
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Email:</label>
          <input 
            {...register("email")} 
            type="email" 
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Password:</label>
          <input 
            {...register("password")} 
            type="password" 
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>

        <input ref={inputFile} type="file" accept="image/png, image/jpeg" className="hidden" onChange={onFileSelected} />

        <div className="flex justify-center my-4">
          <img src={selectedImage ? URL.createObjectURL(selectedImage) : pngegg} alt="placeholder" className="w-32 h-32 rounded-full border border-gray-300" />
        </div>

        <div className="flex justify-center">
          <FontAwesomeIcon icon={faImage} size="2x" className="text-gray-500 cursor-pointer hover:text-gray-700 transition" onClick={() => inputFile.current?.click()} />
        </div>

        <button type="submit" className="w-full mt-6 bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition">Register</button>
      </form>
    </div>
  );
};

export default UserForm;
