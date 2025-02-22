import { FC } from "react";
import UserForm from "./UserForm";

interface RegistrationFormProps {
  setIsLoggedIn: (loggedIn: boolean) => void; // ✅ Accept setIsLoggedIn as prop
}

const RegistrationForm: FC<RegistrationFormProps> = ({ setIsLoggedIn }) => {
  return (
    <div>
      <UserForm setIsLoggedIn={setIsLoggedIn} /> {/* ✅ Pass it to UserForm */}
    </div>
  );
};

export default RegistrationForm;
