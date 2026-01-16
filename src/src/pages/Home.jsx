import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import HighLightText from "../components/core/Homepage/highlightext";
import Button from "../components/core/Homepage/Button";
import CodeBlocks from "../components/core/Homepage/CodeBlocks";
import TimeLineSection from "../components/core/Homepage/TimeLineSection";
import LearningLanguage from "../components/core/Homepage/LearningLanguage";
import Instructor from "../components/core/Instructor";
import ExporeMore from "../components/core/Homepage/ExporeMore";
import Footer from "../components/core/Homepage/footer";
import ReviewSLider from "../components/core/common/ReviewSLider";
const Home = () => {
  return (
    <div className="min-h-screen bg-[#0b1220] text-white">
      <div className="flex flex-col items-center max-w-maxContent mx-auto">
        {/* Button */}
        <div className="pt-24">
          <Link to="/signup">
            <div className="group rounded-full bg-linear-to-r from-richblack-700 to-richblack-800 px-6 py-2 text-sm font-medium text-richblack-100 shadow-[0_0_20px_rgba(255,255,255,0.05)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]">
              <div className="flex items-center gap-2">
                <span>Become an Instructor</span>
                <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        </div>

        {/* Heading */}
        <div className="mt-10 text-center text-4xl  font-semibold max-w-4xl">
          Empower Your Future with <HighLightText text="Coding Skills" />
        </div>
        <div className="w-[95%] text-center text-lg  text-richblack-300 mt-2">
          With our online coding courses, you can learn at your own pace, from
          anywhere in the world, and get access to a wealth of resources,
          including hands-on projects, quizzes, and personalized feedback from
          instructors.
        </div>

        <div className="flex gap-7 mt-8">
          <Button active={true} Linkto={"/sinup"}>
            Learn More
          </Button>
          <Button active={false} Linkto={"/sinup"}>
            Book Demo
          </Button>
        </div>
        {/* Banner Video */}
        <div className="relative mt-10 w-full flex justify-center">
          {/* Background Glow */}
          <div className="absolute inset-0 flex justify-center">
            <div
              className="w-[85%] max-w-4xl h-full 
      bg-linear-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20
      blur-3xl rounded-full"
            ></div>
          </div>

          {/* Video Card */}
          <div
            className="relative z-10 rounded-sm 
    shadow-[0_20px_50px_rgba(59,130,246,0.35)]
    hover:shadow-[0_30px_70px_rgba(59,130,246,0.45)]
    transition-all duration-500"
          >
            <video
              muted
              loop
              autoPlay
              className="w-[90%] max-w-4xl rounded-xl 
      border border-richblack-700
      hover:scale-[1.01]  
      transition-transform duration-500"
            >
              <source src="/Images/banner.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
        {/* {Code Section 1 } */}
        <div>
          <CodeBlocks
            position={"lg:flex-row"}
            heading={
              <div className="text-4xl font-semibold">
                Unlock Your
                <HighLightText text={"coding Potential"} />
              </div>
            }
            subheading={
              "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
            }
            Button1={{
              btnText: "Try it Yourself",
              linkto: "/sinup",
              active: true,
            }}
            button2={{
              btnText: "Learn More",
              linkto: "/Login",
              active: false,
            }}
            CodeBlocks={`<!DOCTYPE html>
<html>
<head><title>Example</title>
<link rel="stylesheet"href="styles.css">
</head>
<body>
<h1><a href="/">Header</a>
</h1>
<nav>
<a href="one/">One</a><a href="two/">Two</a>
<a href="three/">Three</a>
</nav>
</body>
</html>
`}
            codecolor={"text-yellow-24"}
          />
        </div>

        {/* {Secition 2} */}
        <div>
          <CodeBlocks
            position="lg:flex-row-reverse"
            heading={
              <div className="text-4xl font-robotoMono ">
                Unlock Your
                <HighLightText text={"coding Potential"} />
              </div>
            }
            subheading={
              "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
            }
            Button1={{
              btnText: "Try it Yourself",
              linkto: "/sinup",
              active: true,
            }}
            button2={{
              btnText: "Learn More",
              linkto: "/Login",
              active: false,
            }}
            CodeBlocks={`<!DOCTYPE html>
<html>
<head><title>Example</title>
<link rel="stylesheet"href="styles.css">
</head>
<body>
<h1><a href="/">Header</a>
</h1>
<nav>
<a href="one/">One</a><a href="two/">Two</a>
<a href="three/">Three</a>
</nav>
</body>
</html>
`}
            codecolor={"text-yellow-24"}
          />
        </div>
        <ExporeMore />
      </div>
      {/* section 2 */}
      <div className="w-full bg-[#fffefd]  ">
        <div className="homepage_bg h-77.5">
          <div className="w-11/12 max-w-maxContent flex flex-col items-center gap-1 mx-auto justify-between">
            <div className="h-37.5"></div>
            <div className="flex gap-3 flex-row text-white">
              <Button active={true} linkto="/sinup">
                <div className="flex items-center gap-3">
                  Explore Full Catelog
                  <FaArrowRight />
                </div>
              </Button>
              <Button active={false} linkto={"/signup"}>
                <div className="bg-black">Learn More</div>
              </Button>
            </div>
          </div>
        </div>
        {/* skills wala Part  */}

        <div className="mx-auto w-11/12 max-w-maxContent py-16">
          {/* Row 1: Heading + Text */}
          <div className="flex items-start justify-between gap-10">
            {/* LEFT - Heading */}
            <div className="w-[50%] text-4xl font-semibold leading-12 text-black">
              Get the skills you need for a{" "}
              <HighLightText text={"job that is in demand"} />
            </div>

            {/* RIGHT - Paragraph */}
            <div className="w-[45%]">
              <p className="text-[16px] text-[#0b1220] leading-6">
                The modern StudyNotion dictates its own terms. Today, to be a
                competitive specialist requires more than professional skills.
              </p>
              <div className="mt-8 relative right-[16vw] flex justify-center">
                <Button active={true} linkto={"/signup"}>
                  Learn More
                </Button>
              </div>
            </div>
          </div>
          <TimeLineSection />
          <LearningLanguage />
          {/* Row 2: Centered Button */}
        </div>
      </div>

      {/* section3  */}
      <div className="w-full mx-auto max-w-maxContent flex-col items-center justify-between gap-8 first-letter:  bg-linear-to-r from-[#020617] via-[#020b1f] to-[#020617] text-white">
        <Instructor />
        <div className="text-[#fff]">
          <h1 className="flex justify-center items-center font-semibold text-3xl">Reviews from other learners</h1>
        </div>
        <ReviewSLider />
      </div>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default Home;
