import { FC, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import pngegg from "../assets/pngegg.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import userService from "../Services/user_service";


// ✅ Validation Schema
const UserSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters long" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
  email: z.string().email({ message: "Invalid email" }),
});

type FormData = z.infer<typeof UserSchema>;

const UserForm: FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const inputFile = useRef<HTMLInputElement>(null);

  const onFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      setSelectedImage(event.target.files[0]);
    }
  };

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(UserSchema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const userPayload = {
        username: data.name,
        password: data.password,
        email: data.email,
      };

      console.log("📤 Sending Register Request:", userPayload);

      const registerResponse = await userService.register(userPayload);
      console.log("✅ Register Response:", registerResponse.data);

      const userId = registerResponse.data._id ?? "";
      if (!userId) {
        console.error("❌ Error: User ID is missing!");
        return;
      }

      let imageUrl = "";
      if (selectedImage) {
        console.log("📤 Uploading Image:", selectedImage);
        const uploadResponse = await userService.uploadImage(selectedImage);
        imageUrl = uploadResponse.data.url;
        console.log("✅ Image Uploaded:", imageUrl);
      }

      if (imageUrl) {
        await userService.updateProfile({ userId, avatar: imageUrl });
        console.log(`✅ Updated Profile for ${registerResponse.data.username} with avatar: ${imageUrl}`);
      }
    } catch (error) {
      console.error("❌ Registration Error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form 
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white shadow-lg rounded-lg p-6"
      >
        <h1 className="text-2xl font-bold text-center mb-6">Register</h1>

        {/* Username Field */}
        <div className="mb-4">
          <label className="block text-gray-700">Username:</label>
          <input 
            {...register("name")} 
            type="text" 
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>

        {/* Email Field */}
        <div className="mb-4">
          <label className="block text-gray-700">Email:</label>
          <input 
            {...register("email")} 
            type="email" 
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>

        {/* Password Field */}
        <div className="mb-4">
          <label className="block text-gray-700">Password:</label>
          <input 
            {...register("password")} 
            type="password" 
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>

        {/* File Input (Hidden) */}
        <input
          ref={inputFile}
          type="file"
          accept="image/png, image/jpeg"
          className="hidden"
          onChange={onFileSelected}
        />

        {/* Image Preview */}
        <div className="flex justify-center my-4">
          <img 
            src={selectedImage ? URL.createObjectURL(selectedImage) : pngegg} 
            alt="placeholder" 
            className="w-32 h-32 rounded-full border border-gray-300"
          />
        </div>

        {/* Image Upload Button */}
        <div className="flex justify-center">
          <FontAwesomeIcon 
            icon={faImage} 
            size="2x" 
            className="text-gray-500 cursor-pointer hover:text-gray-700 transition"
            onClick={() => inputFile.current?.click()} 
          />
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          className="w-full mt-6 bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default UserForm;
