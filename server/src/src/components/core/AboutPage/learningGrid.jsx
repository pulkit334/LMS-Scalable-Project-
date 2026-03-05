import React from "react";

const LearningGridArray = [
  {
    order: -1,
    heading: "World-Class Learning for",
    highlightText: "Anyone, Anywhere",
    description:
      "Studynotion partners with more than 275+ leading universities and companies to bring flexible, affordable, job-relevant online learning to individuals and organizations worldwide.",
    BtnText: "Learn More",
    BtnLink: "/",
  },
  {
    order: 1,
    heading: "Curriculum Based on Industry Needs",
    description:
      "Save time and money! The Belajar curriculum is made to be easier to understand and in line with industry needs.",
  },
  {
    order: 2,
    heading: "Our Learning Methods",
    description:
      "Studynotion partners with more than 275+ leading universities and companies to bring flexible learning solutions.",
  },
  {
    order: 3,
    heading: "Certification",
    description:
      "Studynotion partners with more than 275+ leading universities and companies to bring recognized certifications.",
  },
  {
    order: 4,
    heading: 'Rating "Auto-grading"',
    description:
      "Studynotion partners with more than 275+ leading universities and companies to bring smart evaluation systems.",
  },
  {
    order: 5,
    heading: "Ready to Work",
    description:
      "Studynotion partners with more than 275+ leading universities and companies to bring job-ready skills.",
  },
];

const LearningGrid = () => {

  return (
    <section className="w-full bg-linear-to-b from-[#020617] to-[#000814]">
      <div className="mx-auto max-w-7xl min-h-195 px-6 py-24 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-4 lg:grid-rows-2 gap-0 lg:grid-flow-dense">
          {LearningGridArray.map((card, index) => {
            // HERO
            if (index === 0) {
              return (
                <div
                  key={index}
                  className="
                lg:col-start-1 lg:col-span-2 lg:row-start-1 lg:row-span-2
                flex flex-col justify-start pt-0 pr-16
              "
                >
                  <h1 className="text-[42px] font-bold leading-[1.15] text-white">
                    {card.heading}
                    <br />
                    <span className="text-cyan-400">{card.highlightText}</span>
                  </h1>

                  <p className="mt-6 max-w-110 text-[15px] leading-relaxed text-gray-300">
                    {card.description}
                  </p>

                  <button className="mt-8 w-fit rounded-md bg-yellow-400 px-7 py-3 text-sm font-semibold text-black hover:bg-yellow-300 transition">
                    {card.BtnText}
                  </button>
                </div>
              );
            }

            // CARDS
            return (
              <div
                key={index}
                className={`
              p-15 w-auto
              ${
                card.order === 1
                  ? "lg:col-start-3 lg:row-start-1 bg-[#2C333F]"
                  : ""
              }
              ${
                card.order === 2
                  ? "lg:col-start-4 lg:row-start-1 bg-[#161D29]"
                  : ""
              }
              ${
                card.order === 3
                  ? "lg:col-start-2 lg:row-start-2 bg-[#2C333F]"
                  : ""
              }
              ${
                card.order === 4
                  ? "lg:col-start-3 lg:row-start-2 bg-[#161D29]"
                  : ""
              }
              ${
                card.order === 5
                  ? "lg:col-start-4 lg:row-start-2 bg-[#2C333F]"
                  : ""
              }
             "
             
            `}
              >
                <h3 className="text-[18px] font-semibold text-white">
                  {card.heading}
                </h3>

                <p className="mt-4  text-[14px] leading-relaxed text-gray-300">
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
export default LearningGrid;
