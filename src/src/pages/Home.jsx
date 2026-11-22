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
    <div className="min-h-screen bg-[#020617] text-white">
      <div className="flex flex-col items-center max-w-7xl mx-auto px-4 sm:px-6">
        {/* Button */}
        <div className="pt-16 sm:pt-20">
          <Link to="/signup">
            <div className="group rounded-full bg-slate-900/90 border border-white/10 px-5 py-2 text-sm font-medium text-slate-200 shadow-lg shadow-black/30 transition-all duration-300 hover:border-amber-400/40 hover:text-amber-300">
              <div className="flex items-center gap-2">
                <span>Become an Instructor</span>
                <FaArrowRight className="text-xs transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        </div>

        {/* Heading */}
        <h1 className="mt-8 text-center text-3xl sm:text-5xl font-bold tracking-tight max-w-4xl leading-tight">
          Empower Your Future with <HighLightText text="Coding Skills" />
        </h1>
        <p className="w-full max-w-2xl text-center text-base sm:text-lg text-slate-400 mt-4 leading-relaxed">
          With our online coding courses, you can learn at your own pace, from
          anywhere in the world, and get access to a wealth of resources,
          including hands-on projects, AI-powered quizzes, study notes, and
          personalized feedback from instructors.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <Button active={true} Linkto={"/signup"}>
            Learn More
          </Button>
          <Button active={false} Linkto={"/catalog"}>
            Explore Courses
          </Button>
        </div>
        {/* Banner Video */}
        <div className="relative mt-12 w-full flex justify-center">
          {/* Background Glow */}
          <div className="absolute inset-0 flex justify-center pointer-events-none">
            <div
              className="w-[80%] max-w-4xl h-full
      bg-linear-to-r from-blue-500/15 via-indigo-500/15 to-cyan-500/15
      blur-3xl rounded-full"
            ></div>
          </div>

          {/* Video Card */}
          <div
            className="relative z-10 w-full max-w-4xl mx-auto rounded-2xl overflow-hidden
    ring-1 ring-white/10
    shadow-[0_24px_70px_rgba(0,0,0,0.65)]
    transition-all duration-500"
          >
            <video
              muted
              loop
              autoPlay
              playsInline
              className="w-full block rounded-2xl"
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
              linkto: "/signup",
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
              linkto: "/signup",
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
            <div className="flex flex-wrap justify-center gap-4 flex-row text-white">
              <Button active={true} Linkto="/catalog">
                <div className="flex items-center gap-2.5">
                  Explore Full Catalog
                  <FaArrowRight className="text-xs" />
                </div>
              </Button>
              <Button active={false} Linkto={"/signup"}>
                Learn More
              </Button>
            </div>
          </div>
        </div>
        {/* skills wala Part  */}

        <div className="mx-auto w-11/12 max-w-7xl py-16">
          {/* Row 1: Heading + Text */}
          <div className="flex flex-col lg:flex-row items-start justify-between gap-10">
            {/* LEFT - Heading */}
            <div className="lg:w-[50%] text-3xl sm:text-4xl font-bold tracking-tight leading-tight text-slate-900">
              Get the skills you need for a{" "}
              <HighLightText text={"job that is in demand"} />
            </div>

            {/* RIGHT - Paragraph */}
            <div className="lg:w-[45%]">
              <p className="text-base text-slate-600 leading-relaxed">
                The modern LMS dictates its own terms. Today, to be a
                competitive specialist requires more than professional skills.
              </p>
              <div className="mt-6">
                <Button active={true} Linkto={"/signup"}>
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
