import React from "react";
import HighLightText from "./highlightext";
import Know_your_progress from "/Images/Know_your_progress.png";
import Compare_with_others from "/Images/Compare_with_others.png";
import Plan_your_lessons from "/Images/Plan_your_lessons.png";
import Button from "./Button";
const LearningLanguage = () => {
  return (
    <div className="mt-[130px]">
  <div className="flex flex-col items-center gap-5">

    <div className="flex flex-col gap-4">
      <h2 className="text-4xl pt-2 text-black font-semibold text-center">
        Your Swiss Knife For{" "}
        <HighLightText text="learning any Language" />
      </h2>

      <p className="text-center text-gray-800 mx-auto text-base font-medium w-[70%]">
        Using Spin makes learning multiple languages easy. With 20+ languages,
        realistic voice-over, progress tracking, custom schedules and more.
      </p>
    </div>

    <div className="flex items-center justify-center mt-10">
      <img src={Know_your_progress} className="object-contain -mr-32" />
      <img src={Compare_with_others} />
      <img src={Plan_your_lessons} className="-ml-36" />
    </div>

    {/* CENTERED BUTTON */}
    <div className="flex justify-center mt-10">
      <Button active={true} Linkto={"/signup"}>
        Learn More
      </Button>
    </div>

  </div>
</div>  

  );
};

export default LearningLanguage;
