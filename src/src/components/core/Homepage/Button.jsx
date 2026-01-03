
import React from "react";
import { Link } from "react-router-dom";

const Button = ({ children, active, Linkto }) => {
  return (
    <Link to={Linkto}>
      <div
        className={`px-8 py-3 rounded-md text-[13px] font-bold transition-all duration-200
          ${
            active
              ? "bg-yellow-500 text-richblack-900"
              : "bg-[#0b1220] text-richblack-50"
          }
          hover:scale-95 transition-all duration-200
        `}
      >
        {children}
      </div>
    </Link>
  );
};

export default Button;
