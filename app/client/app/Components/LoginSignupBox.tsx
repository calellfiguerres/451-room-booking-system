import React from "react";
import { Link } from "react-router-dom";

interface LoginSignupBoxProps {
  loginLink: string;
}

const LoginSignupBox: React.FC<LoginSignupBoxProps> = ({ loginLink }) => {
  return (
    <div className="
      p-3 bg-gray-100 rounded-lg
      border border-gray-300
      flex items-center space-x-3
      shadow-sm
    ">
      <Link
        to={loginLink}
        className="
          px-4 py-1.5 bg-blue-500 text-white text-sm font-medium rounded-md
          hover:bg-blue-600
          transition duration-150 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        "
      >
        Login/Signup
      </Link>      
    </div>
  );
};

export default LoginSignupBox;