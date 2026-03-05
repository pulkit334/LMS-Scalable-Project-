import React from "react";

const StudentOnly = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0a1f44",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        textAlign: "center",
        fontSize: "24px",
        fontWeight: "600",
      }}
    >
      This route is only for students
    </div>
  );
};

export default StudentOnly;
