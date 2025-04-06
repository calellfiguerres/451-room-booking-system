import React from "react";
import { Link } from "react-router-dom";

interface LoginSignupBoxProps {
  loginLink: string;
  signupLink: string;
}

const LoginSignupBox: React.FC<LoginSignupBoxProps> = ({ loginLink, signupLink }) => {
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
        Login
      </Link>

      <Link
        to={signupLink}
        className="
          px-4 py-1.5 bg-green-500 text-white text-sm font-medium rounded-md
          hover:bg-green-600
          transition duration-150 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
        "
      >
        Sign Up
      </Link>
    </div>
  );
};

export default LoginSignupBox;