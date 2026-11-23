import React from "react";

const Result = ({ loading, text = "Loading..." }) => {
  if (!loading) return null;

  return (
    <div className="w-full flex flex-col items-center justify-center gap-3 py-20">
      <div className="w-10 h-10 border-4 border-red-800 border-t-white rounded-full animate-spin"></div>
      <p className="text-gray-400 text-sm">{text}</p>
    </div>
  );
};

export default Result;
