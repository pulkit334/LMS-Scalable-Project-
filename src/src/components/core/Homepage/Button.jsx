import React from "react";
import { Link } from "react-router-dom";

const Button = ({ children, active, Linkto, linkto }) => {
  const target = Linkto || linkto || "/signup";
  return (
    <Link to={target} className="inline-block">
      <div
        className={`px-7 py-3 rounded-lg text-sm font-semibold tracking-tight transition-all duration-200
          ${
            active
              ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20 hover:bg-amber-300 hover:shadow-amber-400/35"
              : "bg-slate-900/90 text-slate-100 border border-white/15 hover:bg-slate-800 hover:border-white/25"
          }
          hover:-translate-y-0.5 active:translate-y-0
        `}
      >
        {children}
      </div>
    </Link>
  );
};

export default Button;
