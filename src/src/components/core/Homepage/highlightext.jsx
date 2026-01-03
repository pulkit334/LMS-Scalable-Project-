import React from "react";

const HighLightText = ({ text }) => {
  return (
    <span className="font-bold bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent ">
        {" "}
      {text}
    </span>
  );
};

export default HighLightText;
