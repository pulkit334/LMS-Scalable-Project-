/* eslint-disable no-unused-vars */
import React from "react";
import Button from "../Homepage/Button";
import HighLightText from "./highlightext";
import { FaArrowRight } from "react-icons/fa";
import { TypeAnimation } from "react-type-animation";
const CodeBlocks = ({
  position,
  heading,
  subheading,
  Button1,
  button2,
  CodeBlocks,
  backgroundgradient,
  codecolor,
  btnText,
  reverse,
}) => {
  return (
    <div
      className={`flex flex-col lg:flex-row ${position} my-20 mt-2px gap-20`}
    >
      {/* SECTION 1 */}
      <div className="w-[90%] lg:w-1/2 flex  flex-col gap-8">
        {/* Heading */}
        <h1 className="text-4xl  font-semibold leading-[48px] text-white">
          Unlock your <span className="text-cyan-400">coding potential</span>
          <br />
          with our online courses.
        </h1>

        {/* Subheading */}
        <p className="text-richblack-300 text-sm leading-6 max-w-[520px]">
          Our courses are designed and taught by industry experts who have years
          of experience in coding and are passionate about sharing their
          knowledge with you.
        </p>

        {/* Buttons */}
        <div className="flex gap-5 mt-6">
          <Button active={Button1.active} Linkto={Button1.Linkto}>
            <div className="flex gap-2 items-center">{Button1.btnText}</div>
          </Button>

          <Button active={button2.active} Linkto={button2.Linkto}>
            <div className="flex gap-2 items-center">{button2.btnText}</div>
          </Button>
        </div>
      </div>

      {/* SECTION 2 – CODE BLOCK */}

      <div
        className="relative w-full bg-gradient-to-br from-[#0b1220]/90  via-[#0b1220]/60 to-transparent rounded-xl lg:w-[500px] gap-8 
    transition-transform duration-300 ease-out
hover:scale-[0.98]
hover:translate-y-1
origin-top-left"
      >
        {/*  GRADIENT SHADOW */}
        <div
          className="absolute -inset-1 bg-gradient-to-tr
               from-[#8A2BE2] via-[#FFA500] to-yellow-400
               opacity-30 blur-2xl rounded-2xl z-[-1] 
"
        />

        {/* CODE BLOCK */}
        <div
          className="relative h-fit flex flex-row 
                  bg-richblack-800  rounded-lg py-4 shadow-lg"
        >
          {/* LINE NUMBERS */}
          <div
            className="text-center flex flex-col w-[10%]
                    text-[#F5F5F5] z-[-3] font-mono text-xs
                    font-semibold leading-5"
          >
            <p>1</p>
            <p>2</p>
            <p>3</p>
            <p>4</p>
            <p>5</p>
            <p>6</p>
            <p>7</p>
            <p>8</p>
            <p>9</p>
            <p>10</p>
            <p>11</p>
            <p>12</p>
          </div>

          {/* CODE */}
          <div
            className={`w-[90%] font-mono text-xs leading-5 ${codecolor} pr-2`}
          >
            <TypeAnimation
              sequence={[CodeBlocks, 1500]}
              speed={90}
              repeat={Infinity}
              cursor={true}
              style={{ whiteSpace: "pre-line", display: "block" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeBlocks;
