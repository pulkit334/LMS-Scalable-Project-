import React from "react";
import HighLightText from "../components/core/Homepage/highlightext";
import Quote from "../components/core/AboutPage/qoute";
import StatsComponents from "../components/core/AboutPage/StatsComponents";
import LearningGrid from "../components/core/AboutPage/learningGrid";
import ContactFormSection from "../components/core/AboutPage/ContactFormSection";
const About = () => {
  return (
    <div className="bg-[#2C333F] text-white">
      {/* HERO SECTION  section  1*/}
      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <h1 className="text-4xl font-bold md:text-5xl">
          Driving Innovation in Online Education for{" "}
          <HighLightText text="Brighter Future" />
        </h1>

        <p className="mx-auto mt-6 max-w-3xl text-gray-400">
          Studynotion is at the forefront of driving innovation in online
          education. We're passionate about creating a brighter future by
          offering cutting-edge courses, leveraging emerging technologies, and
          nurturing a vibrant learning community.
        </p>

        {/* IMAGES */}
        {/* IMAGES */}
        <div className="mt-16 flex justify-center gap-10">
          <div className="h-65 w-100 overflow-hidden bg-white shadow-lg">
            <img
              src="/Images/aboutus1.webp"
              alt=""
              className="h-full w-full object-cover"
            />
          </div>

          <div className="h-65 w-90 overflow-hidden bg-white shadow-lg">
            <img
              src="/Images/aboutus2.webp"
              alt=""
              className="h-full w-full object-cover"
            />
          </div>

          <div className="h-65 w-90 overflow-hidden bg-white shadow-lg">
            <img
              src="/Images/aboutus3.webp"
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* QUOTE SECTION  section 2 */}
      <section className="bg-linear-to-b from-[#020617] to-[#0B0F1A]">
        <Quote />
      </section>
      {/* Section 3 */}
      <section className="w-full bg-linear-to-b from-[#020617] to-[#000814] py-20">
        <div className="mx-auto max-w-7xl px-6">
          {/* -------- Founding Story -------- */}
          <div className="flex justify-center flex-col items-center gap-12 lg:flex-row lg:items-start">
            {/* Left Content */}
            <div className="flex-1">
              <h1 className="mb-6 text-3xl font-bold text-pink-500">
                Our Founding Story
              </h1>

              <p className="mb-4 text-sm leading-relaxed text-gray-400">
                Our e-learning platform was born out of a shared vision and
                passion for transforming education. It all began with a group of
                educators, technologists, and lifelong learners who recognized
                the need for accessible, flexible, and high-quality learning
                opportunities in a rapidly evolving digital world.
              </p>

              <p className="text-sm leading-relaxed text-gray-400">
                As experienced educators ourselves, we witnessed firsthand the
                limitations and challenges of traditional education systems. We
                believed that education should not be confined to the walls of a
                classroom or restricted by geographical boundaries. We
                envisioned a platform that could bridge these gaps and empower
                individuals from all walks of life to unlock their full
                potential.
              </p>
            </div>

            {/* Right Image */}
            <div className="flex flex-1 justify-center lg:justify-end">
              <img
                src="/Images/FoundingStory.png"
                alt="Founding Story"
                className="rounded-xl border border-pink-500/30 shadow-[0_0_40px_rgba(236,72,153,0.35)]"
              />
            </div>
          </div>

          {/* -------- Vision & Mission -------- */}
          <div className="mt-24 flex flex-col gap-16 lg:flex-row">
            {/* Vision */}
            <div className="flex-1">
              <h1 className="mb-4 text-2xl font-bold text-orange-400">
                Our Vision
              </h1>
              <p className="text-sm leading-relaxed text-gray-400">
                With this vision in mind, we set out on a journey to create an
                e-learning platform that would revolutionize the way people
                learn. Our team of dedicated experts worked tirelessly to
                develop a robust and intuitive platform that combines
                cutting-edge technology with engaging content, fostering a
                dynamic and interactive learning experience.
              </p>
            </div>

            {/* Mission */}
            <div className="flex-1">
              <h1 className="mb-4 text-2xl font-bold text-cyan-400">
                Our Mission
              </h1>
              <p className="text-sm leading-relaxed text-gray-400">
                Our mission goes beyond just delivering courses online. We
                wanted to create a vibrant community of learners, where
                individuals can connect, collaborate, and learn from one
                another. We believe that knowledge thrives in an environment of
                sharing and dialogue, and we foster this spirit of collaboration
                through forums, live sessions, and networking opportunities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* secitton 4 */}
      <StatsComponents />

      {/* Section 5 */}
      <section className="flex flex-col justify-between gap-5 mb-10">
        <LearningGrid />
        <ContactFormSection />
      </section>
    </div>
  );
};

export default About;
