import React from "react";

const Empty = () => {
  return (
    <>
      <div className="min-h-screen bg-[#020617] text-white px-16 py-10">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-16">
          <h1 className="text-3xl font-semibold">My Courses</h1>

          <button className="bg-yellow-400 text-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition">
            Add Course +
          </button>
        </div>

        {/* EMPTY STATE */}
        <div className="flex flex-col items-center justify-center gap-8">
          {/* Top Line */}
          <div className="w-full h-px bg-gray-700" />

          {/* Text */}
          <p className="text-2xl text-gray-300 tracking-wide">
            No Courses Found
          </p>
        </div>
      </div>
    </>
  );
};

export default Empty;
