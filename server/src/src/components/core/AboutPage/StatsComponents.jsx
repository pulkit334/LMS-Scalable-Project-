import React from "react";

const stats = [
  { count: "5K", label: "Active Students" },
  { count: "10+", label: "Mentors" },
  { count: "200+", label: "Courses" },
  { count: "50+", label: "Awards" },
];

const StatsComponents = () => {
  return (
    <section className="w-full bg-[#2C333F] py-14">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center justify-between gap-11 sm:flex-row">
          {stats.map((data, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center"
            >
              <h3 className="text-4xl font-bold text-white">
                {data.count}
              </h3>
              <p className="mt-2 text-sm font-medium text-gray-400">
                {data.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsComponents;
