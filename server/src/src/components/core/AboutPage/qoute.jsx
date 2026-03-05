import React from "react";
import HighLightText from "../Homepage/highlightext";

const Quote = () => {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16 text-center">
      <p className="text-2xl font-semibold leading-snug text-white md:text-3xl">
        We are passionate about revolutionizing the way we learn. Our innovative
        platform{" "}
        <HighLightText text="combines technology," />
        <span className="text-orange-400">expertise,</span>{" "}
        and community to create an{" "}
        <span className="text-orange-400">
          unparalleled educational experience.
        </span>
      </p>
    </div>
  );
};

export default Quote;
