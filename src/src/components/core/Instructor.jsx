
import { FaArrowRight } from "react-icons/fa";

const Instructor = () => {
  return (
    <div className="w-full bg-[#020b1f] bg-linear-to-r from-[#020617] via-[#020b1f] to-[#020617] py-24">
      <div className="mx-auto max-w-6xl flex flex-col lg:flex-row items-center gap-20 px-6">

        {/* Left Image */}
        <div className="w-full lg:w-1/2 relative">

          <img
            src="/Images/Instructor.png"
            alt="Instructor"
          />
        </div>

        {/* Right Content */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6">

          {/* Heading */}
          <h2 className="text-4xl font-semibold text-white">
            Become an{" "}
            <span className="text-cyan-400 font-semibold">
              instructor
            </span>
          </h2>

          {/* Description */}
          <p className="text-[15px] leading-6 text-slate-300 max-w-130">
            Instructors from around the world teach millions of students on
            StudyNotion. We provide the tools and skills to teach what you love.
          </p>

          {/* Button */}
          <div className="mt-6">
            <button className="flex items-center gap-2 bg-yellow-400 text-black font-semibold px-6 py-3 rounded-md hover:bg-yellow-300 transition">
              Start Teaching Today
              <FaArrowRight />
            </button>
          </div>


        </div>
      </div>
    </div>
  );
};



export default Instructor;
