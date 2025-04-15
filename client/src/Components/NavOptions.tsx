import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/NavOptions.css";
import { User } from "../App";

interface NavOptionsProps {
  user: User | null;
}

const NavOptions: React.FC<NavOptionsProps> = (user) => {
  const navigate = useNavigate();

  return (
    <>
      {user ? (
        <div className="navOptions">
          <button
            onClick={() => navigate("/dashboard")}
            title="Go back to Dashboard"
          >
            &#x2B05;
          </button>
        </div>
      ) : (
        <div className="navOptions">
          <button onClick={() => navigate("/checkin")} title="Go to Checkin">
            Student Checkin
          </button>
          <button onClick={() => navigate("/login")} title="Go to Login">
            Login
          </button>
        </div>
      )}
    </>
  );
};

export default NavOptions;
